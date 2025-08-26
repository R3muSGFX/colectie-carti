<template>
  <div class="about-page">
    <h1>
      <i class="pi pi-info-circle" style="margin-right: 0.5rem;"></i>
      Despre Proiect
    </h1>

    <!-- Card Tehnologii -->
    <Card class="about-section">
      <template #title>
        <i class="pi pi-code" style="margin-right: 0.5rem;"></i>
        Tehnologii folosite
      </template>
      <template #content>
        <div class="tech-icons">
          <div class="tech-item">
            <i class="pi pi-vue" style="font-size: 2rem;"></i>
            <span>
              <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
                Vue 3
              </a>
            </span>
          </div>
          <div class="tech-item">
            <i class="pi pi-palette" style="font-size: 2rem;"></i>
            <span>
              <a href="https://www.primefaces.org/primevue/" target="_blank" rel="noopener noreferrer">
                PrimeVue
              </a>
            </span>
          </div>
          <div class="tech-item">
            <i class="pi pi-star" style="font-size: 2rem;"></i>
            <span>
              <a href="https://www.primefaces.org/primeicons/" target="_blank" rel="noopener noreferrer">
                PrimeIcons
              </a>
            </span>
          </div>
        </div>
      </template>
    </Card>

    <!-- Card Despre UI -->
    <Card class="about-section">
      <template #title>
        <i class="pi pi-smile" style="margin-right: 0.5rem;"></i>
        Despre UI
      </template>
      <template #content>
        <p>
          Interfața a fost construită folosind 
          <a href="https://www.primefaces.org/primevue/" target="_blank" rel="noopener noreferrer">
            PrimeVue
          </a>, care oferă componente moderne, responsive și ușor de personalizat.
          Iconițele sunt preluate din 
          <a href="https://www.primefaces.org/primeicons/" target="_blank" rel="noopener noreferrer">
            PrimeIcons
          </a> pentru a crea o experiență vizuală plăcută și intuitivă.
        </p>
        <p>
          Obiectivul a fost să oferim utilizatorului o interfață clară, rapidă și
          plăcută vizual.
        </p>
      </template>
    </Card>

    <!-- Card Scopul proiectului -->
    <Card class="about-section">
      <template #title>
        <i class="pi pi-heart" style="margin-right: 0.5rem;"></i>
        Scopul proiectului
      </template>
      <template #content>
        <p>
          Acest proiect este un exemplu de integrare a 
          <a href="https://vuejs.org/" target="_blank" rel="noopener noreferrer">
            Vue 3
          </a> cu 
          <a href="https://www.primefaces.org/primevue/" target="_blank" rel="noopener noreferrer">
            PrimeVue
          </a>, arătând cum se pot crea interfețe moderne și responsive cu efort minim.
        </p>
      </template>
    </Card>
  </div>
</template>

<script setup>
import Card from 'primevue/card'
</script>

<style scoped>
.about-page {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.about-section {
  padding: 1rem;
}

.tech-icons {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.tech-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1.1rem;
  gap: 0.5rem;
}

a {
  color: #007ad9;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
