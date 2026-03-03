<script setup lang="ts">
import { ref } from 'vue'
import { predictHousePrice, type HousePredictionInput } from '../services/api'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Message from 'primevue/message'

const emit = defineEmits<{
  prediction: [price: number]
  error: [message: string]
  loading: [isLoading: boolean]
}>()


const form = ref<Partial<HousePredictionInput>>({
  OverallQual: 5,
  GrLivArea: 2000,
  '1stFlrSF': 2000,
  '2ndFlrSF': 0,
  FullBath: 2,
  TotRmsAbvGrd: 8,
  YearBuilt: 2000,
  LotArea: 10000,
  KitchenQual: 'TA',
  Foundation: 'PConc',
  ExterQual: 'TA',
  Neighborhood: 'NAmes',
})

const isSubmitting = ref(false)
const formErrors = ref<Record<string, string>>({})

const qualityOptions = Array.from({ length: 10 }, (_, i) => ({
  label: `${i + 1} - ${getQualityLabel(i + 1)}`,
  value: i + 1,
}))

const kitchenQualOptions = [
  { label: 'Poor', value: 'Po' },
  { label: 'Fair', value: 'Fa' },
  { label: 'Typical', value: 'TA' },
  { label: 'Good', value: 'Gd' },
  { label: 'Excellent', value: 'Ex' },
]

const exterQualOptions = [
  { label: 'Poor', value: 'Po' },
  { label: 'Fair', value: 'Fa' },
  { label: 'Typical', value: 'TA' },
  { label: 'Good', value: 'Gd' },
  { label: 'Excellent', value: 'Ex' },
]

const foundationOptions = [
  { label: 'Poured Concrete', value: 'PConc' },
  { label: 'Concrete Block', value: 'CBlock' },
  { label: 'Brick & Tile', value: 'BrkTil' },
  { label: 'Slab', value: 'Slab' },
  { label: 'Stone', value: 'Stone' },
  { label: 'Wood', value: 'Wood' },
]

const heatingQCOptions = [
  { label: 'Poor', value: 'Po' },
  { label: 'Fair', value: 'Fa' },
  { label: 'Typical', value: 'TA' },
  { label: 'Good', value: 'Gd' },
  { label: 'Excellent', value: 'Ex' },
]

const electricalOptions = [
  { label: 'Standard Circuit Breaker', value: 'SBrkr' },
  { label: 'Fuse Box - A', value: 'FuseA' },
  { label: 'Fuse Box - F', value: 'FuseF' },
  { label: 'Fuse Box - P', value: 'FuseP' },
  { label: 'Mixed', value: 'Mix' },
]

const neighborhoods = [
  { label: 'North Ames', value: 'NAmes' },
  { label: 'College Creek', value: 'CollgCr' },
  { label: 'Clear Creek', value: 'ClearCr' },
  { label: 'Old Town', value: 'OldTown' },
  { label: 'Edwards', value: 'Edwards' },
  { label: 'Somerset', value: 'Somerst' },
  { label: 'Gilbert', value: 'Gilbert' },
  { label: 'Northridge', value: 'NridgHt' },
  { label: 'Sawyer', value: 'Sawyer' },
  { label: 'Sawyer West', value: 'SawyerW' },
  { label: 'No Ridge', value: 'NoRidge' },
]

function getQualityLabel(value: number): string {
  const labels: Record<number, string> = {
    1: 'Very Poor',
    2: 'Poor',
    3: 'Fair',
    4: 'Below Average',
    5: 'Average',
    6: 'Above Average',
    7: 'Good',
    8: 'Very Good',
    9: 'Excellent',
    10: 'Very Excellent',
  }
  return labels[value] || ''
}

const validateForm = (): boolean => {
  formErrors.value = {}

  if (!form.value.OverallQual || form.value.OverallQual < 1 || form.value.OverallQual > 10) {
    formErrors.value.OverallQual = 'Quality must be between 1 and 10'
  }

  if (!form.value.GrLivArea || form.value.GrLivArea <= 0) {
    formErrors.value.GrLivArea = 'Living area must be greater than 0'
  }

  if (!form.value['1stFlrSF'] || form.value['1stFlrSF'] <= 0) {
    formErrors.value['1stFlrSF'] = 'First floor area must be greater than 0'
  }

  if (!form.value.FullBath || form.value.FullBath < 0 || form.value.FullBath > 5) {
    formErrors.value.FullBath = 'Full bathrooms must be between 0 and 5'
  }

  if (!form.value.TotRmsAbvGrd || form.value.TotRmsAbvGrd < 0 || form.value.TotRmsAbvGrd > 20) {
    formErrors.value.TotRmsAbvGrd = 'Total rooms must be between 0 and 20'
  }

  if (!form.value.YearBuilt || form.value.YearBuilt < 1800 || form.value.YearBuilt > 2025) {
    formErrors.value.YearBuilt = 'Year must be between 1800 and 2025'
  }

  if (!form.value.LotArea || form.value.LotArea <= 0) {
    formErrors.value.LotArea = 'Lot area must be greater than 0'
  }

  if (form.value.LotArea && form.value.GrLivArea && form.value.LotArea <= form.value.GrLivArea) {
    formErrors.value.LotArea = 'Lot area must be larger than living area'
  }

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  emit('loading', true)

  try {
    const cleanedData = {
      ...form.value,
      YearRemodAdd: form.value.YearRemodAdd || undefined,
      GarageYrBlt: form.value.GarageYrBlt || undefined,
      GarageCars: form.value.GarageCars || undefined,
      GarageArea: form.value.GarageArea || undefined,
      TotalBsmtSF: form.value.TotalBsmtSF || undefined,
      MasVnrArea: form.value.MasVnrArea || undefined,
      Fireplaces: form.value.Fireplaces || undefined,
      LotFrontage: form.value.LotFrontage || undefined,
      '2ndFlrSF': form.value['2ndFlrSF'] || undefined,
      HalfBath: form.value.HalfBath || undefined,
      HeatingQC: form.value.HeatingQC || undefined,
      Electrical: form.value.Electrical || undefined,
    } as HousePredictionInput

    const result = await predictHousePrice(cleanedData)
    emit('prediction', result.predicted_price)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get prediction'
    emit('error', message)
  } finally {
    isSubmitting.value = false
    emit('loading', false)
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form-container">
    <Message v-if="Object.keys(formErrors).length > 0" severity="error" :closable="false">
      <div style="display: flex; flex-direction: column; gap: 0.5rem;">
        <span>Please fix the following errors:</span>
        <ul style="list-style-position: inside; margin: 0; padding: 0;">
          <li v-for="(error, field) in formErrors" :key="field">{{ error }}</li>
        </ul>
      </div>
    </Message>

    <div>
      <h3 style="font-size: 1.125rem; font-weight: bold; color: white; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
        <i class="pi pi-check-circle" style="color: #22c55e;"></i>
        Required Information
      </h3>

      <div class="form-row">
        <!-- Overall Quality -->
        <div class="form-group">
          <label for="overall" class="form-label">Overall Quality</label>
          <Dropdown
            id="overall"
            v-model="form.OverallQual"
            :options="qualityOptions"
            option-label="label"
            option-value="value"
            placeholder="Select quality level"
          />
        </div>

        <!-- Living Area -->
        <div class="form-group">
          <label for="living-area" class="form-label">Living Area (sq ft)</label>
          <InputNumber
            id="living-area"
            v-model="form.GrLivArea"
            :min="1"
            placeholder="e.g., 2000"
          />
        </div>

        <!-- 1st Floor -->
        <div class="form-group">
          <label for="first-floor" class="form-label">1st Floor Area (sq ft)</label>
          <InputNumber
            id="first-floor"
            v-model="form['1stFlrSF']"
            :min="1"
            placeholder="e.g., 1000"
          />
        </div>

        <!-- Full Bathrooms -->
        <div class="form-group">
          <label for="bathrooms" class="form-label">Full Bathrooms</label>
          <InputNumber
            id="bathrooms"
            v-model="form.FullBath"
            :min="0"
            :max="5"
            placeholder="e.g., 2"
          />
        </div>

        <!-- Total Rooms -->
        <div class="form-group">
          <label for="rooms" class="form-label">Total Rooms</label>
          <InputNumber
            id="rooms"
            v-model="form.TotRmsAbvGrd"
            :min="0"
            :max="20"
            placeholder="e.g., 8"
          />
        </div>

        <!-- Year Built -->
        <div class="form-group">
          <label for="year" class="form-label">Year Built</label>
          <InputNumber
            id="year"
            v-model="form.YearBuilt"
            :min="1800"
            :max="2025"
            placeholder="e.g., 2000"
          />
        </div>

        <!-- Lot Area -->
        <div class="form-group">
          <label for="lot" class="form-label">Lot Area (sq ft)</label>
          <InputNumber
            id="lot"
            v-model="form.LotArea"
            :min="1"
            placeholder="e.g., 10000"
          />
        </div>

        <!-- Kitchen Quality -->
        <div class="form-group">
          <label for="kitchen" class="form-label">Kitchen Quality</label>
          <Dropdown
            id="kitchen"
            v-model="form.KitchenQual"
            :options="kitchenQualOptions"
            option-label="label"
            option-value="value"
            placeholder="Select quality"
          />
        </div>

        <!-- Foundation -->
        <div class="form-group">
          <label for="foundation" class="form-label">Foundation Type</label>
          <Dropdown
            id="foundation"
            v-model="form.Foundation"
            :options="foundationOptions"
            option-label="label"
            option-value="value"
            placeholder="Select foundation"
          />
        </div>

        <!-- Exterior Quality -->
        <div class="form-group">
          <label for="exterior" class="form-label">Exterior Quality</label>
          <Dropdown
            id="exterior"
            v-model="form.ExterQual"
            :options="exterQualOptions"
            option-label="label"
            option-value="value"
            placeholder="Select quality"
          />
        </div>

        <!-- Neighborhood -->
        <div class="form-group">
          <label for="neighborhood" class="form-label">Neighborhood</label>
          <Dropdown
            id="neighborhood"
            v-model="form.Neighborhood"
            :options="neighborhoods"
            option-label="label"
            option-value="value"
            placeholder="Select neighborhood"
          />
        </div>
      </div>
    </div>

    <div style="border-top: 1px solid rgba(34, 197, 94, 0.3); margin: 2rem 0;"></div>

    <!-- Optional Fields -->
    <div>
      <h3 style="font-size: 1.125rem; font-weight: bold; color: white; margin: 0 0 1.5rem 0; display: flex; align-items: center; gap: 0.5rem;">
        <i class="pi pi-plus-circle" style="color: #22c55e;"></i>
        Optional Details
      </h3>

      <div class="form-row">
        <!-- Year Remodeled -->
        <div class="form-group">
          <label for="remodel" class="form-label">Year Remodeled</label>
          <InputNumber
            id="remodel"
            v-model="form.YearRemodAdd"
            :min="1800"
            :max="2025"
            placeholder="Leave blank if not remodeled"
          />
        </div>

        <!-- Garage Year -->
        <div class="form-group">
          <label for="garage-year" class="form-label">Garage Year Built</label>
          <InputNumber
            id="garage-year"
            v-model="form.GarageYrBlt"
            :min="1800"
            :max="2025"
            placeholder="Leave blank if no garage"
          />
        </div>

        <!-- Garage Cars -->
        <div class="form-group">
          <label for="garage-cars" class="form-label">Garage Cars Capacity</label>
          <InputNumber
            id="garage-cars"
            v-model="form.GarageCars"
            :min="0"
            :max="5"
            placeholder="Number of cars"
          />
        </div>

        <!-- Garage Area -->
        <div class="form-group">
          <label for="garage-area" class="form-label">Garage Area (sq ft)</label>
          <InputNumber
            id="garage-area"
            v-model="form.GarageArea"
            :min="0"
            placeholder="Garage area"
          />
        </div>

        <!-- Basement -->
        <div class="form-group">
          <label for="basement" class="form-label">Basement Area (sq ft)</label>
          <InputNumber
            id="basement"
            v-model="form.TotalBsmtSF"
            :min="0"
            placeholder="Total basement area"
          />
        </div>

        <!-- Masonry -->
        <div class="form-group">
          <label for="masonry" class="form-label">Masonry Veneer Area (sq ft)</label>
          <InputNumber
            id="masonry"
            v-model="form.MasVnrArea"
            :min="0"
            placeholder="Masonry veneer area"
          />
        </div>

        <!-- Fireplaces -->
        <div class="form-group">
          <label for="fireplaces" class="form-label">Number of Fireplaces</label>
          <InputNumber
            id="fireplaces"
            v-model="form.Fireplaces"
            :min="0"
            :max="5"
            placeholder="Number of fireplaces"
          />
        </div>

        <!-- Lot Frontage -->
        <div class="form-group">
          <label for="frontage" class="form-label">Lot Frontage (linear ft)</label>
          <InputNumber
            id="frontage"
            v-model="form.LotFrontage"
            :min="0"
            placeholder="Street frontage length"
          />
        </div>

        <!-- 2nd Floor -->
        <div class="form-group">
          <label for="second-floor" class="form-label">2nd Floor Area (sq ft)</label>
          <InputNumber
            id="second-floor"
            v-model="form['2ndFlrSF']"
            :min="0"
            placeholder="Second floor area"
          />
        </div>

        <!-- Half Bathrooms -->
        <div class="form-group">
          <label for="half-bath" class="form-label">Half Bathrooms</label>
          <InputNumber
            id="half-bath"
            v-model="form.HalfBath"
            :min="0"
            :max="3"
            placeholder="Number of half baths"
          />
        </div>

        <!-- Heating Quality -->
        <div class="form-group">
          <label for="heating" class="form-label">Heating Quality</label>
          <Dropdown
            id="heating"
            v-model="form.HeatingQC"
            :options="heatingQCOptions"
            option-label="label"
            option-value="value"
            placeholder="Select quality"
          />
        </div>

        <!-- Electrical -->
        <div class="form-group">
          <label for="electrical" class="form-label">Electrical System</label>
          <Dropdown
            id="electrical"
            v-model="form.Electrical"
            :options="electricalOptions"
            option-label="label"
            option-value="value"
            placeholder="Select system"
          />
        </div>
      </div>
    </div>

    <Button
      type="submit"
      :loading="isSubmitting"
      label="Predict Price"
      icon="pi pi-lightning"
      class="w-full"
      size="large"
      :disabled="isSubmitting"
    />
  </form>
</template>

<style scoped>
:deep(.p-inputnumber),
:deep(.p-dropdown) {
  width: 100%;
}

:deep(.p-dropdown) {
  position: relative;
  z-index: 10;
}

:deep(.p-dropdown-panel) {
  position: absolute !important;
  z-index: 9999 !important;
  max-height: 300px;
  overflow-y: auto;
}

:deep(.p-button) {
  width: 100%;
}
</style>