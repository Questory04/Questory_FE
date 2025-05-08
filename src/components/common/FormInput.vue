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
<style>
.input {
    width: 100%;
    max-width: 300px;
    padding: 12px;
    margin-bottom: 1rem;
    border: none;
    border-radius: 8px;
    background-color: #f2f4f6;
    font-size: 1rem;
    box-sizing: border-box;
}

.form-input {
    width: 100%;
}
</style>
