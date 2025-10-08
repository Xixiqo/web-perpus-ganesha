<template>
    <div class="informasi-view">
        <h1>Informasi Perpustakaan</h1>
        <section class="jam-operasional">
            <h2>Jam Operasional</h2>
            <ul>
                <li>Senin - Jumat: 08.00 - 17.00</li>
                <li>Sabtu: 09.00 - 13.00</li>
                <li>Minggu & Hari Libur: Tutup</li>
            </ul>
        </section>
        <section class="kepengurusan">
            <h2>Kepengurusan Perpustakaan</h2>
            <ul>
                <li>Kepala Perpustakaan: Sue Han D no</li>
                <li>Petugas Administrasi: Shoe Hand Dont know</li>
                <li>Petugas Layanan: Xu Khan Don O</li>
            </ul>
        </section>
    </div>
</template>

<script setup>
// Tidak ada logic khusus untuk halaman ini
</script>

<style scoped>
.informasi-view {
    max-width: 600px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}
h1 {
    text-align: center;
    margin-bottom: 24px;
}
section {
    margin-bottom: 24px;
}
h2 {
    color: #2c3e50;
    margin-bottom: 12px;
}
ul {
    list-style: none;
    padding: 0;
}
li {
    margin-bottom: 8px;
    font-size: 16px;
}
</style>