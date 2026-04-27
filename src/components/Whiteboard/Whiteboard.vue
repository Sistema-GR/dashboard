<template>
  <main :class="[
      'relative z-0 flex flex-col min-h-screen overflow-x-hidden transition-all duration-300 ease-in-out bg-gray-50', 
      sidebarClass
    ]">
    <Breadcrumbs 
      v-if="showBreadcrumbs && !hideBreadcrumbs" 
      :pages="breadcrumbPages" 
      :titlePag="title"
    />
    <div >
      <div :class="['w-full rounded-[10px]', customClass]">
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
      sidebarStore.isSidebarMinimized ? 'lg:pl-[72px]' : 'lg:pl-[245px]'
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
      const segments = route.path.split('/').filter(Boolean);
      let currentPath = '';
      const crumbs = segments.map((s, i) => {
        currentPath += `/${s}`;
        return { name: s.charAt(0).toUpperCase() + s.slice(1), href: currentPath, current: i === segments.length - 1 };
      });
      return [{ name: 'Home', href: '/home/overview', current: false }, ...crumbs];
    });

    const showBreadcrumbs = computed(() => {
      const hidden = ['/user/rewards', '/admin/rewards', '/user/faqs'];
      return !hidden.includes(route.path);
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
