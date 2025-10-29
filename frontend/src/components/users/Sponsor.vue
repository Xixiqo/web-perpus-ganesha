<template>
  <div class="w-full py-12 bg-gradient-to-b from-gray-50 to-white overflow-hidden">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-3xl font-bold text-center mb-8 text-gray-800">Kompetisi ini diselenggarakan oleh</h2>
      
      <div class="relative">
        <!-- Gradient Overlays -->
        <div class="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 via-gray-50 to-transparent z-10 pointer-events-none"></div>
        <div class="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none"></div>
        
        <!-- Slider Container -->
        <div class="overflow-hidden">
          <div 
            class="flex gap-8 animate-scroll"
            style="width: fit-content;"
          >
            <!-- First Set -->
            <div 
              v-for="(sponsor, index) in sponsors" 
              :key="`sponsor-1-${index}`"
              class="flex-shrink-0 w-48 h-32 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-6 hover:scale-105"
            >
              <img 
                :src="sponsor.logo" 
                :alt="sponsor.name"
                class="max-w-full max-h-full object-contain transition-transform duration-300"
              />
            </div>
            
            <!-- Second Set (Duplicate for seamless loop) -->
            <div 
              v-for="(sponsor, index) in sponsors" 
              :key="`sponsor-2-${index}`"
              class="flex-shrink-0 w-48 h-32 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 flex items-center justify-center p-6 hover:scale-105"
            >
              <img 
                :src="sponsor.logo" 
                :alt="sponsor.name"
                class="max-w-full max-h-full object-contain transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </div>
      
      <p class="text-center mt-8 text-gray-600 text-sm">Terima kasih kepada semua pihak yang telah menyelenggarakan dan mendukung kompetisi ini.</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SponsorSlider',
  data() {
    return {
      sponsors: [
        {
          name: 'JHIC',
          logo: '/sponsor/sp1.png'
        },
        {
          name: 'Jagoan Hosting',
          logo: '/sponsor/sp2.png'
        },
        {
          name: 'KOMDIGI',
          logo: '/sponsor/sp3.png'
        },
        {
          name: 'Maspion IT',
          logo: '/sponsor/sp4.png'
        },
        {
          name: 'Garuda Spark',
          logo: '/sponsor/sp5.png'
        },
        {
          name: 'STEMBAYO',
          logo: '/sponsor/sp6.png'
        },
        {
          name: 'Perpustakaan Ganesha',
          logo: '/sponsor/sp7.png'
        }
      ]
    }
  }
}
</script>

<style scoped>
@keyframes scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.animate-scroll {
  animation: scroll 20s linear infinite;
}

/* Removed hover pause - animation continues even on hover */
</style>