<template>
    <div class="form-input">
        <input :type="type" :placeholder="placeholder" v-model="localValue" class="input" />
    </div>
</template>

<script>
export default {
    name: "FormInput",
    props: {
        type: {
            type: String,
            default: "text",
        },
        placeholder: String,
        modelValue: String,
    },
    computed: {
        localValue: {
            get() {
                return this.modelValue;
            },
            set(value) {
                this.$emit("update:modelValue", value);
            },
        },
    },
};
</script>

<style scoped>
.input {
    width: 100%;
    max-width: 100%;
    padding: 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    background-color: #f0f2f5;
    font-size: 1rem;
    box-sizing: border-box;
}

.form-input {
    width: 100%;
    flex: 1;
}
</style>
