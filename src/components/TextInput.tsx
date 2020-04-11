import React from "react";
import { TextField, TextFieldProps } from "@material-ui/core";
import { useField } from "formik";

const TextInput = React.forwardRef<HTMLInputElement, TextFieldProps>(
  ({ name, ...rest }: TextFieldProps, ref) => {
    const [field, meta] = useField(name);

    return (
      <TextField
        margin="normal"
        {...rest}
        {...field}
        error={meta.touched && meta.error ? true : false}
        helperText={(meta.touched && meta.error) || ""}
        InputLabelProps={{ shrink: true }}
        ref={ref}
      />
    );
  }
);

export default TextInput;
