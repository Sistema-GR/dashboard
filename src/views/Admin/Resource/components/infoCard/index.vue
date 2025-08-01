<template>
    <div class="w-full bg-[#e3f0ff] border rounded-[10px] p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <router-link class="w-full" to="info">
            <div class="flex gap-4 items-center justify-between w-full flex-wrap lg:flex-nowrap">
                <!-- Avatar e Informações -->
                <div class="flex items-center gap-4 w-full sm:w-auto">
                    <div class="flex-shrink-0">
                        <div class="w-14 h-14 flex items-center justify-center">
                            <UserIcon class="w-14 h-14 text-[#003965]"/>
                        </div>
                    </div>
                    
                    <div class="flex flex-col">
                        <h3 class="text-15 font-bold text-black mb-1">Nome do divo</h3>
                        <p class="text-15 text-black">Deu ruim no pagamento</p>
                    </div>
                </div>

                <!-- Status -->
                <div class="flex flex-col items-center">
                    <p class="text-15 font-bold text-black mb-1">Status</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-15 font-medium bg-red-100 text-red-700">
                        Formação
                    </span>
                </div>

                <!-- Aberto e Data -->
                <div class="flex flex-col items-end">
                    <p class="text-15 font-medium text-black mb-1">Aberto</p>
                    <p class="text-15 text-black">01/01/2025</p>
                </div>
            </div>
        </router-link>
    </div>
</template>

<script>
import { UserIcon } from "@heroicons/vue/24/outline";

export default {
    name: "infoCard",
    components: {UserIcon},
    props: {
        situation:{
            type: String,
        }
    }
}
</script>