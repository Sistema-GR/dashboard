<template>
    <main class="flex flex-row items-center h-screen justify-center py-10 lg:pl-72">
        <div class="px-4 sm:px-6 lg:px-8">
            <h3 class="text-20 text-center font-medium leading-6 text-gray-400">
                Bem Vindo(a) {{ userFullName }}
            </h3>
        </div>
    </main>
</template>


<script>
export default {
  name: "Overview",
  data() {
    return {
      userFullName: "", // Valor padrão enquanto carrega os dados
    };
  },
  methods: {
    async fetchUserInfo() {
        const token = localStorage.getItem("accessToken"); // ou "access_token", conforme necessário
        if (!token) {
            console.error("Token de autenticação não encontrado");
            return;
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/auth/user-info/", {
                headers: {
                    Authorization: `Bearer ${token}`, // Inclui o token corretamente
                },
            });

            if (!response.ok) {
                throw new Error("Erro ao buscar informações do usuário");
            }

            const data = await response.json();

            if (data && data.first_name && data.last_name) {
                const capitalizeWords = (str) => {
                    return str
                        .split(' ') // Divide a string em palavras
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) // Capitaliza cada palavra
                        .join(' '); // Junta as palavras de volta em uma string
                    };
                const firstName = data.first_name.charAt(0).toUpperCase() + data.first_name.slice(1).toLowerCase();
                const lastName = capitalizeWords(data.last_name);
                this.userFullName = `${firstName} ${lastName}`;
            } else {
                console.error("Dados do usuário não contém nome ou sobrenome.");
            }
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error);
        }
    },
  },
  mounted() {
    this.fetchUserInfo();
  },
};
</script>