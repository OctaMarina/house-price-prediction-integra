<script setup lang="ts">
import { ref } from 'vue'
import PredictionForm from './components/PredictionForm.vue'
import PredictionResult from './components/PredictionResult.vue'

const showResult = ref(false)
const predictionPrice = ref<number | null>(null)
const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const handlePrediction = (price: number) => {
  predictionPrice.value = price
  errorMessage.value = null
  showResult.value = true
  isLoading.value = false
}

const handleError = (message: string) => {
  predictionPrice.value = null
  errorMessage.value = message
  showResult.value = true   // ← important fix
  isLoading.value = false
}

const handleLoading = (loading: boolean) => {
  isLoading.value = loading
}

const resetForm = () => {
  showResult.value = false
  predictionPrice.value = null
  errorMessage.value = null
}
</script>

<template>
  <div style="min-height: 100vh; background: linear-gradient(to bottom right, #000, #1a1a1a, #0a0a0a);">
    <div class="header-container">
      <div class="header-content">
        <div>
          <h1 class="header-title">
            <i class="pi pi-home" style="color: #22c55e;"></i>
            House Price Predictor
          </h1>
        </div>
      </div>
    </div>

    <div class="main-container">
      <div class="grid-layout">
        <div>
          <div style="background: rgba(0, 0, 0, 0.4); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 1rem;">
            <div style="background: linear-gradient(to right, #16a34a, #22c55e); padding: 1.5rem 2rem;">
              <h2 style="font-size: 1.5rem; font-weight: bold; color: white; margin: 0;">
                <i class="pi pi-pencil"></i>
                Enter House Details
              </h2>
            </div>

            <div style="padding: 2rem;">
              <PredictionForm
                @prediction="handlePrediction"
                @error="handleError"
                @loading="handleLoading"
              />
            </div>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
          <div v-if="!showResult" style="background: rgba(0,0,0,0.5); border-radius: 1rem; padding: 2rem; text-align: center;">
            <i class="pi pi-inbox icon-5xl" style="color: rgba(34,197,94,0.4);"></i>
            <p style="color: rgba(236,253,245,0.6);">
              Submit the form to see your prediction
            </p>
          </div>

          <PredictionResult
            v-else
            :price="predictionPrice"
            :error="errorMessage"
            @reset="resetForm"
          />
        </div>
      </div>
    </div>
  </div>
</template>
