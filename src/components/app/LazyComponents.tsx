import { lazy } from "react";

export const ResetComponent = (
    lazy(() => (
      import("../app-auth/reset")
    ))
  );

export const SignInComponent = (
    lazy(() => (
        import("../app-auth/signin")
    ))
);

export const ProfileComponent = (
    lazy(() => (
        import("../app-profile")
    ))
);

export const HomeComponent = (
    lazy(() => (
        import("../app-home")
    ))
);

export const RegisterComponent = (
    lazy(() => (
        import("../app-auth/register")
    ))
);

export const PersonComponent = (
    lazy(() => (
        import("../app-person")
    ))
);

export const NotFound404Component = (
    lazy(() => (
        import("../app-404")
    ))
);
