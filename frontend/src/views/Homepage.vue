<script setup>
import image2 from '/images/coffee-waste.webp'
</script>

<template>
  <div class="content-section">
    <div class="overlay">
      <div class="homepage">
        <div class="intro-text">
          <h1>Welcome to CoffeeFuel</h1>
          <p>
            Every day, millions of coffee grounds end up in the trash — but what if they could power something more than just your morning routine?
          </p>
          <p>
            At CoffeeFuel, we believe that even small actions can help fight climate change. By giving coffee grounds a second life as a high-efficiency biofuel, we’re not just reducing organic waste — we’re helping people warm their homes more sustainably.
          </p>
          <p>Traditional wood logs contribute to deforestation and produce more smoke and ash. In contrast, our recycled coffee pellets and logs burn cleaner, produce more heat, and leave behind a smaller carbon footprint. In fact, coffee grounds have a higher energy content than wood, meaning they generate more heat per kilogram — a surprising fact that turns everyday waste into a powerful solution.</p>
        <p>Whether you care about reducing emissions, minimizing your environmental impact, or simply heating your home efficiently, CoffeeFuel is here to make it easy. Join us in rethinking waste and fueling a better future — one cup at a time.</p>
        </div>
        <div class="image-section">
          <img :src="image2" alt="Recycling coffee grounds" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>

.overlay {
  width: 100%;
  max-width: 1100px;
  padding: 3rem;
  background-color: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin: auto;
  font-family: 'Inter', sans-serif;
}

.homepage {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
}

.intro-text {
  text-align: center;
  color: #2c3e50;
}

.intro-text h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
}

.intro-text p {
  font-size: 1.1rem;
  margin: 0.5rem 0;
  line-height: 1.6;
  color: #34495e;
  max-width: 800px;
}

.image-section img {
  width: 100%;
  max-width: 800px;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
</style>
