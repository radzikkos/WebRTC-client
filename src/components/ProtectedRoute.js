import { Route, Navigate } from "react-router-dom";
import auth from "../auth";

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <div>
      <Route
        {...rest}
        render={(props) => {
          false ? <Component {...props} /> : <Navigate to={"/"} />;
        }}
      />
    </div>
  );
};

// import React from "react";
// import { Route, Navigate } from "react-router-dom";

// export const ProtectedRoute = ({
//   component: Component,
//   redirectTo,
//   isAuth,
//   path,
//   ...props
// }) => {
//   if (!isAuth) {
//     return <Navigate to={redirectTo} />;
//   }
//   return <Route path={path} element={<Component />} />;
// };
