import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Suspense, lazy } from "react";
import { CenteredSpinner } from "@/components/ui/centered-spinner";

const LandingPage = lazy(() => import("../../app/page"));
const ErrorPage = lazy(() => import("@/components/ui/error-page"));
const LoginPage = lazy(() => import("@/app/(auth)/login/page"));
const LoginCallbackPage = lazy(
  () => import("@/app/(auth)/login/callback/page")
);
const DashboardPage = lazy(() => import("@/app/dashboard/page"));
const LogoutPage = lazy(() => import("@/app/(auth)/logout/page"));
const SettingPage = lazy(() => import("@/app/settings/page"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <LandingPage />
      </Suspense>
    ),
    errorElement: (
      <Suspense fallback={<CenteredSpinner />}>
        <ErrorPage />
      </Suspense>
    ), // Errors will bubble up to this root component
  },
  {
    path: "/login",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/login/callback",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <LoginCallbackPage />
      </Suspense>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <DashboardPage />
      </Suspense>
    ),
  },
  {
    path: "/settings",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <SettingPage />
      </Suspense>
    ),
  },
  {
    path: "/logout",
    element: (
      <Suspense fallback={<CenteredSpinner />}>
        <LogoutPage />
      </Suspense>
    ),
  },
]);

export default function Router() {
  return <RouterProvider router={router} />;
}
