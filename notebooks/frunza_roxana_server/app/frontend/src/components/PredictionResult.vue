<script setup lang="ts">
import { computed } from 'vue'
import Button from 'primevue/button'
import Message from 'primevue/message'

interface Props {
  price: number | null
  error: string
}

const props = defineProps<Props>()
defineEmits<{ reset: [] }>()

const formattedPrice = computed(() => {
  if (!props.price) return ''
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(props.price)
})
</script>

<template>
  <div v-if="price && !error">
    <div style="background: linear-gradient(135deg, rgba(22, 163, 74, 0.6), rgba(15, 23, 42, 0.6)); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 1rem; overflow: hidden;">
      <div style="background: linear-gradient(to right, #16a34a, #22c55e); padding: 1.5rem; display: flex; align-items: center; justify-content: center;">
        <i class="pi pi-check-circle" style="color: white; font-size: 2rem;"></i>
      </div>

      <div style="padding: 1.5rem; text-align: center;">
        <p style="color: rgba(236, 253, 245, 0.8); font-size: 0.875rem; margin-bottom: 1rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em;">Predicted House Price</p>

        <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 0.75rem; padding: 1.5rem; margin-bottom: 1.5rem;">
          <p style="font-size: 3rem; font-weight: bold; color: #86efac; margin: 0;">{{ formattedPrice }}</p>
          <p style="color: rgba(52, 211, 153, 0.8); font-size: 0.875rem; margin-top: 0.75rem;">Based on your house specifications</p>
        </div>

        <div style="background: rgba(34, 197, 94, 0.2); border: 1px solid rgba(34, 197, 94, 0.3); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem; text-align: left;">
          <p style="color: rgba(236, 253, 245, 0.8); font-size: 0.75rem; margin: 0 0 1rem 0; font-weight: bold; text-transform: uppercase;">PREDICTION DETAILS</p>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; text-align: center;">
            <div>
              <p style="color: rgba(52, 211, 153, 0.8); font-size: 0.75rem; margin: 0;">Algorithm</p>
              <p style="color: rgba(236, 253, 245, 0.8); font-weight: 600; font-size: 0.875rem; margin: 0;">ML Pipeline</p>
            </div>
            <div style="border-left: 1px solid rgba(34, 197, 94, 0.3); border-right: 1px solid rgba(34, 197, 94, 0.3);">
              <p style="color: rgba(52, 211, 153, 0.8); font-size: 0.75rem; margin: 0;">Accuracy</p>
              <p style="color: rgba(236, 253, 245, 0.8); font-weight: 600; font-size: 0.875rem; margin: 0;">High</p>
            </div>
            <div>
              <p style="color: rgba(52, 211, 153, 0.8); font-size: 0.75rem; margin: 0;">Time</p>
              <p style="color: rgba(236, 253, 245, 0.8); font-weight: 600; font-size: 0.875rem; margin: 0;">{{ new Date().toLocaleTimeString() }}</p>
            </div>
          </div>
        </div>

        <Button
          @click="$emit('reset')"
          label="Predict Another House"
          icon="pi pi-home"
          class="w-full"
          size="large"
        />
      </div>
    </div>
  </div>

  <div v-else-if="error">
    <Message severity="error" :text="error" class="w-full" style="margin-bottom: 1rem;" />
    <div style="background: linear-gradient(135deg, rgba(127, 29, 29, 0.6), rgba(15, 23, 42, 0.6)); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 1rem; overflow: hidden;">
      <div style="background: linear-gradient(to right, #dc2626, #f87171); padding: 1.5rem; display: flex; align-items: center; justify-content: center;">
        <i class="pi pi-exclamation-circle" style="color: white; font-size: 2rem;"></i>
      </div>

      <div style="padding: 1.5rem; text-align: center;">
        <h3 style="font-size: 1.25rem; font-weight: bold; color: rgba(252, 165, 165, 0.8); margin: 0 0 1rem 0;">Prediction Failed</h3>

        <div style="background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 0.75rem; padding: 1rem; margin-bottom: 1.5rem;">
          <p style="color: rgba(252, 165, 165, 0.8); font-size: 0.875rem; margin: 0;">{{ error }}</p>
        </div>

        <p style="color: rgba(252, 165, 165, 0.8); font-size: 0.875rem; margin-bottom: 1.5rem;">Please check your input and try again.</p>

        <Button
          @click="$emit('reset')"
          label="Back to Form"
          icon="pi pi-arrow-left"
          size="large"
          severity="danger"
          class="w-full"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.p-button) {
  width: 100%;
}
</style>