import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/admin/login",
  },
});

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/admin/profile/:path*",
    "/admin/hero/:path*",
    "/admin/about/:path*",
    "/admin/skills/:path*",
    "/admin/projects/:path*",
    "/admin/experience/:path*",
    "/admin/education/:path*",
    "/admin/certificates/:path*",
    "/admin/blogs/:path*",
    "/admin/music/:path*",
    "/admin/gallery/:path*",
    "/admin/meetups/:path*",
    "/admin/contact/:path*",
    "/admin/messages/:path*",
    "/admin/bookings/:path*",
    "/admin/settings/:path*",
    "/admin/analytics/:path*",
  ],
};