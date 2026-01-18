"use client";

import { Check, Eye, EyeOff, LockKeyhole, X } from "lucide-react";
import React, { useState, useEffect } from "react";
const validationRules = [
  {
    id: "length",
    text: "At least 8 characters",
    regex: /.{8,}/,
  },
  {
    id: "number",
    text: "At least 1 number",
    regex: /\d/,
  },
  {
    id: "lowercase",
    text: "At least 1 lowercase letter",
    regex: /[a-z]/,
  },
  {
    id: "uppercase",
    text: "At least 1 uppercase letter",
    regex: /[A-Z]/,
  },
  {
    id: "special",
    text: "At least 1 special character",
    regex: /[^A-Za-z0-9]/,
  },
];
const ValidationItem = ({ isValid, text }) => (
  <li
    className={`flex items-center transition-colors duration-300 text-sm ${
      isValid ? "text-success " : "text-muted-foreground"
    }`}
  >
    {isValid ? (
      <Check className="h-4 w-4 mr-2" />
    ) : (
      <X className="h-4 w-4 mr-2" />
    )}
    <span>{text}</span>
  </li>
);
const PasswordInput = ({ register }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [validationState, setValidationState] = useState({
    length: false,
    number: false,
    lowercase: false,
    uppercase: false,
    special: false,
  });
  const [isPristine, setIsPristine] = useState(true);
  useEffect(() => {
    if (password === "") {
      setIsPristine(true);
      setValidationState({
        length: false,
        number: false,
        lowercase: false,
        uppercase: false,
        special: false,
      });
      return;
    }
    setIsPristine(false);

    const newValidationState = {
      length: validationRules
        .find((r) => r.id === "length")
        .regex.test(password),
      number: validationRules
        .find((r) => r.id === "number")
        .regex.test(password),
      lowercase: validationRules
        .find((r) => r.id === "lowercase")
        .regex.test(password),
      uppercase: validationRules
        .find((r) => r.id === "uppercase")
        .regex.test(password),
      special: validationRules
        .find((r) => r.id === "special")
        .regex.test(password),
    };

    setValidationState(newValidationState);
  }, [password]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <p
          htmlFor="password"
          className="font-semibold mb-2 text-md"
        >
          Password
        </p>
        <div className="relative">
          <span className="absolute left-3 inset-y-0 flex items-center text-neutral/60">
            <LockKeyhole size={18} />
          </span>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            {...register("password")}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
            className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral hover:text-base-content transition-colors"
            aria-label="Toggle password visibility"
          >
            {showPassword ? (
              <EyeOff size={16} className="text-neutral/60 hover:text-neutral" />
            ) : (
              <Eye size={16} className="text-neutral/60 hover:text-neutral" />
            )}
          </button>
        </div>
      </div>

      {password && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Password requirements:</h3>
            {isPristine && (
              <p className="text-xs text-muted-foreground">
                Enter a password to check
              </p>
            )}
          </div>
          <ul className="space-y-2">
            {validationRules.map((rule) => (
              <ValidationItem
                key={rule.id}
                isValid={validationState[rule.id]}
                text={rule.text}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default PasswordInput;
