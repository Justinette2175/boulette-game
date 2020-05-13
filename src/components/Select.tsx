import React from "react";
import {
  Select as MuiSelect,
  SelectProps,
  FormControl,
  InputLabel,
  FormHelperText,
  MenuItem,
} from "@material-ui/core";
import { useField } from "formik";

interface SelectPropsCustom extends SelectProps {
  options: Array<{ label: string; value: string | number }>;
  helperText?: string;
  labelKey?: string;
  margin?: "none" | "dense";
}

const Select = React.forwardRef<HTMLInputElement, SelectPropsCustom>(
  (
    {
      options,
      label,
      helperText,
      required,
      disabled,
      fullWidth,
      multiple,
      name,
      onChange,
      error: propsError,
      margin,
      ...rest
    }: SelectPropsCustom,
    ref
  ) => {
    const [field, meta, helpers] = useField(name);
    const value = field.value;

    const makeOptions = () =>
      options
        ? options.map(({ label: l, value: v }, i) => {
            return (
              <MenuItem key={`option-${i}`} value={v}>
                {l}
              </MenuItem>
            );
          })
        : null;

    const handleBlur = () => {
      if (!meta.touched) {
        helpers.setTouched(true);
      }
    };

    return (
      <FormControl
        error={meta.touched && !!meta.error}
        disabled={disabled}
        fullWidth={fullWidth}
        required={required}
        margin={margin || "normal"}
      >
        {label && (
          <InputLabel id={name} shrink>
            {label}
          </InputLabel>
        )}
        <MuiSelect
          ref={ref}
          labelId={field.name}
          displayEmpty
          value={value}
          onChange={field.onChange}
          onBlur={handleBlur}
          inputProps={{ name: field.name, id: field.name }}
          {...rest}
        >
          {makeOptions()}
        </MuiSelect>
        <FormHelperText>{(meta.touched && meta.error) || ""}</FormHelperText>
      </FormControl>
    );
  }
);

export default Select;
