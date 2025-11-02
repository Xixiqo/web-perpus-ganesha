<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
    <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-scale-in">
      <!-- Header -->
      <div class="px-6 py-4 border-b flex items-center justify-between bg-gradient-to-r from-[#2C64F9] to-[#1e4fd6]">
        <h2 class="text-2xl font-bold text-white">
          {{ isEdit ? 'Edit Article' : 'Create New Article' }}
        </h2>
        <button
          @click="$emit('close')"
          class="w-8 h-8 rounded-lg hover:bg-white/20 flex items-center justify-center transition text-white"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="flex-1 overflow-y-auto p-6 space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Title <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.title"
            type="text"
            required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition"
            placeholder="Enter article title"
          />
        </div>

        <!-- Category & Reading Time -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Category <span class="text-red-500">*</span>
            </label>
            <select
              v-model="form.category"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition"
            >
              <option value="">Select category</option>
              <option value="Perpustakaan">Perpustakaan</option>
              <option value="Literasi">Literasi</option>
              <option value="Pendidikan">Pendidikan</option>
              <option value="Teknologi">Teknologi</option>
              <option value="Komunitas">Komunitas</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Reading Time (minutes)
            </label>
            <input
              v-model.number="form.reading_time"
              type="number"
              min="1"
              max="60"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition"
              placeholder="5"
            />
          </div>
        </div>

        <!-- Author Name -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Author Name
          </label>
          <input
            v-model="form.author_name"
            type="text"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent transition"
            placeholder="Admin"
          />
        </div>

        <!-- Cover Image -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Cover Image <span class="text-red-500">*</span>
          </label>
          <div class="space-y-3">
            <div v-if="coverImagePreview" class="relative rounded-lg overflow-hidden">
              <img
                :src="coverImagePreview"
                class="w-full h-48 object-cover"
                alt="Cover preview"
              />
              <button
                type="button"
                @click="removeCoverImage"
                class="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow-lg"
              >
                <svg class="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div v-else>
              <input
                ref="coverInput"
                type="file"
                accept="image/*"
                @change="handleCoverUpload"
                class="hidden"
              />
              <button
                type="button"
                @click="$refs.coverInput.click()"
                :disabled="uploading.cover"
                class="w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C64F9] transition text-gray-600 hover:text-[#2C64F9] flex flex-col items-center justify-center space-y-2"
              >
                <div v-if="uploading.cover" class="w-8 h-8 border-2 border-[#2C64F9] border-t-transparent rounded-full animate-spin"></div>
                <svg v-else class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span class="font-medium">{{ uploading.cover ? 'Uploading...' : 'Click to upload cover image' }}</span>
                <span class="text-xs text-gray-500">PNG, JPG, WEBP up to 5MB</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Content <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="form.content"
            required
            rows="12"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2C64F9] focus:border-transparent font-mono text-sm transition"
            placeholder="Write your article content here...

Use ## for section headings:
## Introduction
Your introduction paragraph here...

## Main Content
Your main content here...

Separate paragraphs with double line breaks."
          ></textarea>
          <p class="text-xs text-gray-500 mt-2">
            💡 Tip: Use <code class="bg-gray-100 px-1 py-0.5 rounded">##</code> for section headings, separate paragraphs with double line breaks
          </p>
        </div>

        <!-- Additional Images -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Additional Images (Optional - max 3)
          </label>
          <p class="text-xs text-gray-500 mb-3">These images will be displayed within the article content</p>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Image 1 -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Image 1</label>
              <div v-if="image1Preview" class="relative mb-2 rounded-lg overflow-hidden">
                <img
                  :src="image1Preview"
                  class="w-full h-32 object-cover"
                  alt="Image 1"
                />
                <button
                  type="button"
                  @click="removeImage(1)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs shadow"
                >
                  ×
                </button>
              </div>
              <div v-else>
                <input
                  ref="image1Input"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload(1)"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.image1Input.click()"
                  :disabled="uploading.image_1"
                  class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C64F9] transition flex flex-col items-center justify-center space-y-1"
                >
                  <div v-if="uploading.image_1" class="w-6 h-6 border-2 border-[#2C64F9] border-t-transparent rounded-full animate-spin"></div>
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-gray-500">{{ uploading.image_1 ? 'Uploading...' : 'Upload' }}</span>
                </button>
              </div>
            </div>

            <!-- Image 2 -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Image 2</label>
              <div v-if="image2Preview" class="relative mb-2 rounded-lg overflow-hidden">
                <img
                  :src="image2Preview"
                  class="w-full h-32 object-cover"
                  alt="Image 2"
                />
                <button
                  type="button"
                  @click="removeImage(2)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs shadow"
                >
                  ×
                </button>
              </div>
              <div v-else>
                <input
                  ref="image2Input"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload(2)"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.image2Input.click()"
                  :disabled="uploading.image_2"
                  class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C64F9] transition flex flex-col items-center justify-center space-y-1"
                >
                  <div v-if="uploading.image_2" class="w-6 h-6 border-2 border-[#2C64F9] border-t-transparent rounded-full animate-spin"></div>
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-gray-500">{{ uploading.image_2 ? 'Uploading...' : 'Upload' }}</span>
                </button>
              </div>
            </div>

            <!-- Image 3 -->
            <div>
              <label class="block text-xs font-medium text-gray-600 mb-2">Image 3</label>
              <div v-if="image3Preview" class="relative mb-2 rounded-lg overflow-hidden">
                <img
                  :src="image3Preview"
                  class="w-full h-32 object-cover"
                  alt="Image 3"
                />
                <button
                  type="button"
                  @click="removeImage(3)"
                  class="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full hover:bg-red-600 transition text-xs shadow"
                >
                  ×
                </button>
              </div>
              <div v-else>
                <input
                  ref="image3Input"
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload(3)"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.image3Input.click()"
                  :disabled="uploading.image_3"
                  class="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#2C64F9] transition flex flex-col items-center justify-center space-y-1"
                >
                  <div v-if="uploading.image_3" class="w-6 h-6 border-2 border-[#2C64F9] border-t-transparent rounded-full animate-spin"></div>
                  <svg v-else class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span class="text-xs text-gray-500">{{ uploading.image_3 ? 'Uploading...' : 'Upload' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Publish Status -->
        <div class="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
          <input
            v-model="form.is_published"
            type="checkbox"
            id="publish"
            class="w-5 h-5 text-[#2C64F9] border-gray-300 rounded focus:ring-[#2C64F9]"
          />
          <label for="publish" class="text-sm font-semibold text-gray-700 cursor-pointer">
            Publish immediately (article will be visible to public)
          </label>
        </div>
      </form>

      <!-- Footer -->
      <div class="px-6 py-4 border-t bg-gray-50 flex items-center justify-end space-x-3">
        <button
          type="button"
          @click="$emit('close')"
          class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
        >
          Cancel
        </button>
        <button
          @click="handleSubmit"
          :disabled="saving || !form.cover_image"
          class="px-6 py-2 bg-[#2C64F9] text-white rounded-lg hover:bg-[#1e4fd6] transition flex items-center space-x-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div v-if="saving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>{{ saving ? 'Saving...' : (isEdit ? 'Update Article' : 'Create Article') }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const props = defineProps({
  article: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'saved'])

const isEdit = computed(() => !!props.article)

const form = ref({
  title: '',
  category: '',
  reading_time: 5,
  author_name: 'Admin',
  cover_image: '',
  content: '',
  image_1: '',
  image_2: '',
  image_3: '',
  is_published: true
})

const uploading = ref({
  cover: false,
  image_1: false,
  image_2: false,
  image_3: false
})

const saving = ref(false)

// Image previews
const coverImagePreview = ref('')
const image1Preview = ref('')
const image2Preview = ref('')
const image3Preview = ref('')

// Load article data if editing
watch(() => props.article, (article) => {
  if (article) {
    form.value = {
      title: article.title || '',
      category: article.category || '',
      reading_time: article.reading_time || 5,
      author_name: article.author_name || 'Admin',
      cover_image: article.cover_image || '',
      content: article.content || '',
      image_1: article.image_1 || '',
      image_2: article.image_2 || '',
      image_3: article.image_3 || '',
      is_published: article.is_published !== false
    }
    
    // Set preview images
    if (article.cover_image) {
      coverImagePreview.value = article.cover_image.startsWith('http') 
        ? article.cover_image 
        : `${API_BASE_URL}${article.cover_image}`
    }
    if (article.image_1) {
      image1Preview.value = article.image_1.startsWith('http') 
        ? article.image_1 
        : `${API_BASE_URL}${article.image_1}`
    }
    if (article.image_2) {
      image2Preview.value = article.image_2.startsWith('http') 
        ? article.image_2 
        : `${API_BASE_URL}${article.image_2}`
    }
    if (article.image_3) {
      image3Preview.value = article.image_3.startsWith('http') 
        ? article.image_3 
        : `${API_BASE_URL}${article.image_3}`
    }
  }
}, { immediate: true })

// Upload cover image
const handleCoverUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  uploading.value.cover = true

  try {
    const formData = new FormData()
    formData.append('cover_image', file)

    const response = await fetch(`${API_BASE_URL}/api/articles/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (data.success) {
      form.value.cover_image = data.data.filename
      coverImagePreview.value = `${API_BASE_URL}/uploads/articles/${data.data.filename}`
    } else {
      alert('Failed to upload image: ' + (data.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
  } finally {
    uploading.value.cover = false
  }
}

// Upload additional images
const handleImageUpload = async (imageNumber) => {
  const inputRef = `image${imageNumber}Input`
  const file = eval(`$refs.${inputRef}`)?.files[0]
  if (!file) return

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('File size must be less than 5MB')
    return
  }

  const fieldName = `image_${imageNumber}`
  uploading.value[fieldName] = true

  try {
    const formData = new FormData()
    formData.append(fieldName, file)

    const response = await fetch(`${API_BASE_URL}/api/articles/upload`, {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (data.success) {
      form.value[fieldName] = data.data.filename
      
      const previewUrl = `${API_BASE_URL}/uploads/articles/${data.data.filename}`
      if (imageNumber === 1) image1Preview.value = previewUrl
      if (imageNumber === 2) image2Preview.value = previewUrl
      if (imageNumber === 3) image3Preview.value = previewUrl
    } else {
      alert('Failed to upload image: ' + (data.message || 'Unknown error'))
    }
  } catch (error) {
    console.error('Upload error:', error)
    alert('Failed to upload image')
  } finally {
    uploading.value[fieldName] = false
  }
}

// Remove images
const removeCoverImage = () => {
  form.value.cover_image = ''
  coverImagePreview.value = ''
}

const removeImage = (imageNumber) => {
  const fieldName = `image_${imageNumber}`
  form.value[fieldName] = ''
  
  if (imageNumber === 1) image1Preview.value = ''
  if (imageNumber === 2) image2Preview.value = ''
  if (imageNumber === 3) image3Preview.value = ''
}

// Submit form
const handleSubmit = async () => {
  if (!form.value.title || !form.value.category || !form.value.content || !form.value.cover_image) {
    alert('Please fill in all required fields (Title, Category, Content, Cover Image)')
    return
  }

  saving.value = true

  try {
    const url = isEdit.value 
      ? `${API_BASE_URL}/api/articles/${props.article.id}`
      : `${API_BASE_URL}/api/articles`
    
    const method = isEdit.value ? 'PUT' : 'POST'

    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('category', form.value.category)
    formData.append('reading_time', form.value.reading_time)
    formData.append('author_name', form.value.author_name)
    formData.append('content', form.value.content)
    formData.append('is_published', form.value.is_published ? 1 : 0)
    
    // Only send image paths (filenames), not full URLs
    if (form.value.cover_image) {
      formData.append('cover_image_url', form.value.cover_image)
    }
    if (form.value.image_1) {
      formData.append('image_1_url', form.value.image_1)
    }
    if (form.value.image_2) {
      formData.append('image_2_url', form.value.image_2)
    }
    if (form.value.image_3) {
      formData.append('image_3_url', form.value.image_3)
    }

    console.log('Submitting:', method, url)

    const response = await fetch(url, {
      method,
      body: formData
    })

    const data = await response.json()
    console.log('Response:', data)

    if (data.success) {
      alert(isEdit.value ? 'Article updated successfully!' : 'Article created successfully!')
      emit('saved')
    } else {
      alert(data.message || 'Failed to save article')
    }
  } catch (error) {
    console.error('Save error:', error)
    alert('Failed to save article: ' + error.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-fade-in {
  animation: fade-in 0.2s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.3s ease-out;
}

code {
  font-family: 'Courier New', monospace;
}
</style>