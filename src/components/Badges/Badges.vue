<template>
    <span :class="badgeClass">

      <svg :class="svgClass" viewBox="0 0 6 6" aria-hidden="true">
        <circle cx="3" cy="3" r="3" />
      </svg>

      {{ text }}

    </span>
  </template>
  
  <script>
  import { MOTIVOS_RECURSO, DEFAULT_MOTIVO } from '@/config/resourceConstants';
  
  export default {
    name: "Badge",
    props: {
      text: {
        type: String,
        required: true
      }
    },
    computed: { 
      motivoStyle() {
        return MOTIVOS_RECURSO.find(motivo => motivo.text === this.text) || DEFAULT_MOTIVO;
      },
      badgeClass() {
        return this.motivoStyle.badgeClass;
      },
      svgClass() {
        return this.motivoStyle.svgClass;
        }
      }
    };
  </script>
  