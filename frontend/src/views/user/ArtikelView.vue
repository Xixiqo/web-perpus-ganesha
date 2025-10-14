<template>
    <div class="artikel-container">
        <h1>Artikel Sederhana</h1>
        <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, urna eu tincidunt consectetur, nisi nisl aliquam urna, eget aliquam massa nisl quis neque. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet.
        </p>
        <p>
            Mauris accumsan, massa non consectetur condimentum, diam arcu tristique enim, quis viverra urna erat nec urna. Proin ac neque nec erat cursus dictum. Suspendisse potenti. Nullam ac erat ante. Integer placerat, urna ut dictum ultricies, elit lorem eleifend lorem, nec laoreet enim lacus a velit.
        </p>
    </div>
</template>

<script>
export default {
    name: 'ArtikelView'
}
</script>

<style scoped>
.artikel-container {
    max-width: 700px;
    margin: 40px auto;
    padding: 24px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
h1 {
    margin-bottom: 16px;
    font-size: 2rem;
    color: #333;
}
p {
    margin-bottom: 12px;
    color: #555;
    line-height: 1.7;
}
</style>