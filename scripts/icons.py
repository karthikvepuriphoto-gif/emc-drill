"""Tiny PNG writer for the PWA icons. No third-party deps."""
import struct
import zlib
from pathlib import Path

def chunk(tag: bytes, data: bytes) -> bytes:
    return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF)

def png(size: int, paint) -> bytes:
    raw = bytearray()
    for y in range(size):
        raw.append(0)
        for x in range(size):
            raw.extend(paint(x, y, size))
    return b"".join([
        b"\x89PNG\r\n\x1a\n",
        chunk(b"IHDR", struct.pack(">IIBBBBB", size, size, 8, 2, 0, 0, 0)),
        chunk(b"IDAT", zlib.compress(bytes(raw), 9)),
        chunk(b"IEND", b""),
    ])

def icon(x, y, size):
    # Chamber-teal field with a copper antenna mark.
    nx = x / (size - 1)
    ny = y / (size - 1)
    bg = (16, 38, 44)
    # isometric diamond
    cx, cy = 0.5, 0.55
    dx, dy = abs(nx - cx), abs(ny - cy) * 1.6
    if dx + dy < 0.28 and ny < 0.72:
        return (231, 241, 240)
    # mast
    if abs(nx - 0.5) < 0.015 and 0.22 < ny < 0.62:
        return (196, 123, 58)
    if abs(ny - 0.30) < 0.012 and abs(nx - 0.5) < 0.08:
        return (231, 241, 240)
    if abs(ny - 0.36) < 0.012 and abs(nx - 0.5) < 0.11:
        return (231, 241, 240)
    return bg

out = Path("public")
for s in (192, 512):
    (out / f"icon-{s}.png").write_bytes(png(s, icon))
print("icons ok")
