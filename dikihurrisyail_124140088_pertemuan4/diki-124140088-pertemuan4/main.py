import math_operations
from math_operations import (
    keliling_persegi,
    keliling_persegi_panjang,
    keliling_lingkaran,
    celsius_ke_kelvin,
)

sisi = 5
panjang = 8
lebar = 4
jari_jari = 7
celsius = 25

print("=== Perhitungan Geometri ===")
print(f"Luas persegi (sisi {sisi})            : {math_operations.luas_persegi(sisi)}")
print(f"Keliling persegi (sisi {sisi})        : {keliling_persegi(sisi)}")
print(f"Luas persegi panjang ({panjang} x {lebar})   : {math_operations.luas_persegi_panjang(panjang, lebar)}")
print(f"Keliling persegi panjang ({panjang} x {lebar}): {keliling_persegi_panjang(panjang, lebar)}")
print(f"Luas lingkaran (r {jari_jari})            : {math_operations.luas_lingkaran(jari_jari):.2f}")
print(f"Keliling lingkaran (r {jari_jari})        : {keliling_lingkaran(jari_jari):.2f}")

print()
print("=== Konversi Suhu ===")
print(f"{celsius} C ke Fahrenheit : {math_operations.celsius_ke_fahrenheit(celsius):.2f} F")
print(f"{celsius} C ke Kelvin     : {celsius_ke_kelvin(celsius):.2f} K")
