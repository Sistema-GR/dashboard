<template>
  <main :class="['flex flex-col overflow-hidden transition-all bg-white', sidebarClass]">
    <Breadcrumbs 
      class="flex w-full" 
      v-if="showBreadcrumbs && !hideBreadcrumbs" 
      :pages="breadcrumbPages" 
      :titlePag="title"
    />
    <div>
      <div class="flex flex-row gap-8 items-center">
      </div>
      <div :class="['flex flex-col items-center w-full rounded-[10px]', customClass]">
        <slot></slot>
      </div>
    </div>
  </main>
</template>

<script>
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.vue';
import { useSidebarStore } from '@/stores/sidebarStore';
import { useRoute } from 'vue-router';
import { computed, watch } from 'vue';
import { debounce } from 'lodash'; 

export default {
  name: "Whiteboard",
  components: { Breadcrumbs },
  props: {
    title: {
      type: String,
      required: true,
      default: 'default Title',
      validator: (value) => typeof value === 'string' && value.length > 0
    },
    customClass: {
      type: String,
      default: 'custom-whiteboard',
      validator: (value) => typeof value === 'string'
    },
    hideBreadcrumbs: {
      type: Boolean,
      default: false
    }
  },

  setup() {
    const route = useRoute();
    const sidebarStore = useSidebarStore();

    const sidebarClass = computed(() =>
      sidebarStore.isSidebarMinimized ? 'lg:pl-20' : 'lg:pl-60'
    );

    const generateBreadcrumbs = (path) => {
      const segments = path.split('/').filter(Boolean);
      let currentPath = '';
      return segments.map((segment, index) => {
        currentPath += `/${segment}`;
        return {
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
          current: index === segments.length - 1,
        };
      });
    };

    const breadcrumbPages = computed(() => {
      const homeBreadcrumb = { name: 'Home', href: '/home/overview', current: false };
      const breadcrumbs = generateBreadcrumbs(route.path);
      return [homeBreadcrumb, ...breadcrumbs];
    });

    const showBreadcrumbs = computed(() => {
      const hiddenRoutes = ['/user/rewards', '/admin/rewards', '/user/faqs'];
      return !hiddenRoutes.includes(route.path);
    });

    watch(
      route,
      debounce(() => {
      }, 300)
    );

    return {
      sidebarClass,
      breadcrumbPages,
      showBreadcrumbs
    };
  },
};
</script>
