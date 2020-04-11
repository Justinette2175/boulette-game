import React from "react";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { addPlayerOnComputer } from "../../redux/game";

const AddPlayerOnComputer: React.FC = () => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
    },
    validationSchema,
    onSubmit: (values) => {
      dispatch(addPlayerOnComputer(values.name));
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <label htmlFor="name">Chose your user name</label>
      <input
        id="name"
        name="name"
        onChange={formik.handleChange}
        value={formik.values.name}
      />
      <button type="submit" disabled={!formik.isValid}>
        Submit
      </button>
    </form>
  );
};

export default AddPlayerOnComputer;
