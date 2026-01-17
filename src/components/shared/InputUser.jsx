import React from "react";

const InputUser = ({icon, register, field, name}) => {
  return (
    <div>
      <label htmlFor="password" className="text-sm font-medium text-neutral/80">
        {title}
      </label>
      <div className="relative">
        <span className="absolute left-3 inset-y-0 flex items-center text-neutral/60">
          {icon}
        </span>
        <input
          id="password"
          value={password}
          {...register(field)}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a strong password"
          className="w-full pl-10 pr-3 py-3 border border-base-300 rounded-lg bg-base-100 text-base-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-transparent transition-all duration-200"
        />
      </div>
    </div>
  );
};

export default InputUser;
