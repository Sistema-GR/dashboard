<template>
    <transition name="toast-fade">
        <div v-if="visible" :class="['toast', typeClass]" role="status">
            <span class="toast-icon">{{ icon }}</span>
            <div class="toast-body">
                <strong class="toast-title">{{ title }}</strong>
                <p class="toast-message">{{ message }}</p>
            </div>
            <button class="toast-close" @click="close" aria-label="Close toast">×</button>
        </div>
    </transition>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'

const props = defineProps({
    message: { type: String, default: '' },
    type: { type: String as () => 'success' | 'error' | 'warning', default: 'success' },
    visible: { type: Boolean, default: false },
    duration: { type: Number, default: 4000 }
})

const emits = defineEmits(['update:visible', 'close'])

const typeClass = computed(() => {
    return {
        success: 'toast--success',
        error: 'toast--error',
        warning: 'toast--warning'
    }[props.type] ?? 'toast--success'
})

const icon = computed(() => {
    return {
        success: '✔',
        error: '✖',
        warning: '⚠'
    }[props.type] ?? '✔'
})

const title = computed(() => {
    return {
        success: 'Sucesso',
        error: 'Erro',
        warning: 'Aviso'
    }[props.type] ?? 'Notificação'
})

let timer: ReturnType<typeof setTimeout> | null = null

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                emits('update:visible', false)
                emits('close')
                timer = null
            }, props.duration)
        } else if (timer) {
            clearTimeout(timer)
            timer = null
        }
    }
)

function close() {
    console.log('Fechando toast manualmente')
    emits('update:visible', false)
    emits('close')
}
</script>

<style scoped>
.toast {
    display: flex;
    align-items: center;
    max-width: 360px;
    padding: 0.9rem 1rem;
    border-radius: 0.9rem;
    box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12);
    color: #000000;
    gap: 0.75rem;
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: 1000;
}

.toast-icon {
    font-size: 1.25rem;
    line-height: 1;
}

.toast-body {
    flex: 1;
}

.toast-title {
    display: block;
    font-weight: 700;
    margin-bottom: 0.2rem;
}

.toast-message {
    margin: 0;
    font-size: 0.95rem;
    line-height: 1.3;
}

.toast-close {
    background: transparent;
    border: none;
    color: inherit;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
    flex-shrink: 0;
    opacity: 0.8;
    transition: opacity 0.2s ease;
}

.toast-close:hover {
    opacity: 1;
}

.toast--success {
    background: 
    #ffffff;
}

.toast--error {
    background: #dc2626;
}

.toast--warning {
    background: #f59e0b;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>