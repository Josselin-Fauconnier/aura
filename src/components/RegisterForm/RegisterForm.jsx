import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Step1Form from "../Step1Form/Step1Form.jsx";
import Step2Form from "../Step2Form/Step2Form.jsx";
import Step3Form from "../Step3Form/Step3Form.jsx";
import {
  validateStep1,
  validateStep2,
  validateStep3,
} from "../../utiles/validations.js";

const RegisterForm = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    role: "client",
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    name: "",
    phoneNumber: "",
    sex: "Autre",
    address: "",
    additionalInformation: "",
    siren: "",
    statut: "Micro-entreprise",
    education: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleRoleChange = (role) => setFormData({ ...formData, role });

  const validateStep = () => {
    let stepErrors = {};
    if (step === 1) stepErrors = validateStep1(formData);
    else if (step === 2) stepErrors = validateStep2(formData);
    else if (step === 3) stepErrors = validateStep3(formData);

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = (e) => {
    e.preventDefault();
    if (!validateStep()) return;
    setStep(step + 1);
    setErrors({});
  };
  const handlePrev = (e) => {
    e.preventDefault();
    setStep(step - 1);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    setLoading(true);
    const endpoint =
      formData.role === "client"
        ? "/api/customer/index.php"
        : "/api/provider/index.php";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert(data.message);
      navigate("/connexion");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'inscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="register-form"
      onSubmit={step === 3 ? handleSubmit : handleNext}
    >
      {step === 1 && (
        <Step1Form
          {...{ formData, handleChange, handleRoleChange, errors, loading }}
        />
      )}
      {step === 2 && (
        <Step2Form {...{ formData, handleChange, errors, loading }} />
      )}
      {step === 3 && (
        <Step3Form {...{ formData, handleChange, errors, loading }} />
      )}

      <div className="register-form__actions">
        {step > 1 && (
          <button type="button" onClick={handlePrev} disabled={loading}>
            Retour
          </button>
        )}
        <button type="submit" disabled={loading}>
          {loading
            ? "Inscription en cours..."
            : step < 3
            ? "Étape suivante"
            : "Finaliser mon inscription"}
        </button>
      </div>
    </form>
  );
};

export default RegisterForm;
