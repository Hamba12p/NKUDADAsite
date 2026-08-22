"""Optimize large site photographs without changing their public paths."""

from __future__ import annotations

import argparse
import io
import os
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


ROOT = Path(__file__).resolve().parent.parent
IMAGE_DIR = ROOT / "public" / "assets" / "images"
MAX_DIMENSION = 1920
JPEG_QUALITY = 78
SUPPORTED_EXTENSIONS = {".jpg", ".jpeg"}


def optimized_bytes(source: Path) -> tuple[bytes, tuple[int, int], tuple[int, int]]:
    with Image.open(source) as opened:
        image = ImageOps.exif_transpose(opened).convert("RGB")
        original_size = image.size
        image.thumbnail((MAX_DIMENSION, MAX_DIMENSION), Image.Resampling.LANCZOS)
        optimized_size = image.size
        output = io.BytesIO()
        save_options = {
            "format": "JPEG",
            "quality": JPEG_QUALITY,
            "optimize": True,
            "progressive": True,
            "subsampling": "4:2:0",
        }
        icc_profile = opened.info.get("icc_profile")
        if icc_profile:
            save_options["icc_profile"] = icc_profile
        image.save(output, **save_options)
        return output.getvalue(), original_size, optimized_size


def replace_atomically(destination: Path, content: bytes) -> None:
    descriptor, temporary_name = tempfile.mkstemp(
        prefix=f".{destination.stem}-",
        suffix=destination.suffix,
        dir=destination.parent,
    )
    temporary_path = Path(temporary_name)
    try:
        with os.fdopen(descriptor, "wb") as temporary_file:
            temporary_file.write(content)
        os.replace(temporary_path, destination)
    finally:
        temporary_path.unlink(missing_ok=True)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--apply",
        action="store_true",
        help="Replace source files. Without this flag, only report projected savings.",
    )
    parser.add_argument(
        "--prefix",
        default="NK-B",
        help="Only process filenames beginning with this value (default: NK-B).",
    )
    args = parser.parse_args()

    candidates = [
        path
        for path in sorted(IMAGE_DIR.iterdir())
        if path.is_file()
        and path.name.startswith(args.prefix)
        and path.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    before_total = 0
    after_total = 0
    changed = 0

    for source in candidates:
        before_size = source.stat().st_size
        content, original_dimensions, optimized_dimensions = optimized_bytes(source)
        after_size = len(content)
        before_total += before_size
        after_total += min(before_size, after_size)

        should_replace = after_size < before_size and (
            max(original_dimensions) > MAX_DIMENSION or after_size <= before_size * 0.9
        )
        status = "optimized" if should_replace else "kept"
        if should_replace:
            changed += 1
            if args.apply:
                replace_atomically(source, content)

        print(
            f"{source.name}: {original_dimensions[0]}x{original_dimensions[1]} -> "
            f"{optimized_dimensions[0]}x{optimized_dimensions[1]}, "
            f"{before_size / 1_048_576:.2f} MB -> {min(before_size, after_size) / 1_048_576:.2f} MB "
            f"({status})"
        )

    saved = before_total - after_total
    action = "Applied" if args.apply else "Projected"
    print(
        f"{action}: {changed}/{len(candidates)} files, "
        f"{before_total / 1_048_576:.2f} MB -> {after_total / 1_048_576:.2f} MB, "
        f"saving {saved / 1_048_576:.2f} MB ({saved / before_total:.1%})."
    )


if __name__ == "__main__":
    main()
