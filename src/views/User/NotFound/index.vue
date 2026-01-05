<template>
    <div class="not-found">
        <div class="card">
            <div class="code">404</div>
            <h1 class="title">Page Not Found</h1>
            <p class="desc">The page you are looking for doesn't exist or has been moved.</p>
            <div class="actions">
                <button class="btn primary" @click="goHome">Go Home</button>
                <button class="btn" @click="goBack">Go Back</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

function goHome() {
    router.push({ path: '/' })
}

function goBack() {
    router.back()
}
</script>

<style scoped>
.not-found {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f5f7fb 0%, #e9eef8 100%);
    padding: 2rem;
    box-sizing: border-box;
}

.card {
    text-align: center;
    background: #fff;
    padding: 48px 36px;
    border-radius: 12px;
    box-shadow: 0 8px 30px rgba(41, 61, 91, 0.08);
    max-width: 640px;
    width: 100%;
}

.code {
    font-size: 96px;
    font-weight: 800;
    color: #1f3a8a;
    line-height: 1;
    letter-spacing: -2px;
}

.title {
    margin: 8px 0 6px;
    font-size: 24px;
    color: #0f172a;
}

.desc {
    margin: 0 0 20px;
    color: #475569;
}

.actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
}

.btn {
    border: 1px solid transparent;
    padding: 10px 18px;
    border-radius: 8px;
    cursor: pointer;
    background: #eef2ff;
    color: #1f2937;
    font-weight: 600;
    transition: transform .08s ease, box-shadow .08s ease;
}

.btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(31,41,55,0.08); }

.btn.primary {
    background: linear-gradient(90deg,#4f46e5,#06b6d4);
    color: #fff;
    border: none;
}
</style>