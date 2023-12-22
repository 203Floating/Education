<template>
  <div>
    <el-select
      v-model="address.province"
      placeholder="Select"
      @change="toLog(address.province)"
      :class="$style.ipt"
    >
      <el-option v-for="item in provinces" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-select
      v-model="address.city"
      placeholder="Select"
      @change="toLog(address.city)"
      :class="$style.ipt"
    >
      <el-option
        v-for="item in cities[address.province]"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
    <el-select
      v-model="address.county"
      placeholder="Select"
      @change="toLog(address.county)"
      :class="$style.ipt"
    >
      <el-option
        v-for="item in counties[address.city]"
        :key="item.id"
        :label="item.name"
        :value="item.id"
      />
    </el-select>
  </div>
</template>
<script setup>
import { defineProps, defineEmits, watch } from 'vue'
const { address } = defineProps({
  address: {
    type: Object
  }
})
const emit = defineEmits()
watch(
  () => address,
  (newValue) => {
    emit('update:address', { ...newValue })
  }
)
console.log(address, 'address')
const toLog = (value) => {
  console.log(value)
}
const provinces = [
  {
    id: 1,
    name: '省1'
  },
  {
    id: 2,
    name: '省2'
  },
  {
    id: 3,
    name: '省3'
  }
]
const cities = {
  1: [
    {
      id: 11,
      name: '1-1'
    },
    {
      id: 12,
      name: '1-2'
    },
    {
      id: 13,
      name: '1-3'
    }
  ],
  2: [
    {
      id: 21,
      name: '2-1'
    },
    {
      id: 22,
      name: '2-2'
    },
    {
      id: 23,
      name: '2-3'
    }
  ],
  3: [
    {
      id: 31,
      name: '3-1'
    },
    {
      id: 32,
      name: '3-2'
    },
    {
      id: 33,
      name: '3-3'
    }
  ]
}
const counties = {
  11: [
    {
      id: 111,
      name: '11-1'
    },
    {
      id: 112,
      name: '11-2'
    },
    {
      id: 113,
      name: '11-3'
    }
  ],
  12: [
    {
      id: 121,
      name: '12-1'
    },
    {
      id: 122,
      name: '12-2'
    },
    {
      id: 123,
      name: '12-3'
    }
  ],
  13: [
    {
      id: 131,
      name: '13-1'
    },
    {
      id: 132,
      name: '13-2'
    },
    {
      id: 133,
      name: '13-3'
    }
  ],
  21: [
    {
      id: 211,
      name: '21-1'
    },
    {
      id: 212,
      name: '21-2'
    },
    {
      id: 213,
      name: '21-3'
    }
  ],
  22: [
    {
      id: 221,
      name: '22-1'
    },
    {
      id: 222,
      name: '22-2'
    },
    {
      id: 223,
      name: '22-3'
    }
  ],
  23: [
    {
      id: 231,
      name: '23-1'
    },
    {
      id: 232,
      name: '23-2'
    },
    {
      id: 233,
      name: '23-3'
    }
  ],
  31: [
    {
      id: 311,
      name: '31-1'
    },
    {
      id: 312,
      name: '31-2'
    },
    {
      id: 313,
      name: '31-3'
    }
  ],
  32: [
    {
      id: 321,
      name: '32-1'
    },
    {
      id: 322,
      name: '32-2'
    },
    {
      id: 323,
      name: '32-3'
    }
  ],
  33: [
    {
      id: 331,
      name: '33-1'
    },
    {
      id: 332,
      name: '33-2'
    },
    {
      id: 333,
      name: '33-3'
    }
  ]
}
</script>
<style module lang="scss">
.ipt {
  @include ipt2;
}
</style>
