from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse
import os


class JobNestHubHandler(SimpleHTTPRequestHandler):

    def do_GET(self):

        routes = {
            "/": "/index.html",
            "/jobs": "/jobs.html",
            "/login": "/login.html",
            "/jobseeker-dashboard": "/jobseeker-dashboard.html",
            "/companies": "/companies.html",
            "/about": "/about.html",
            "/contact": "/contact.html",
            "/apply": "/apply.html",
            "/applications": "/applications.html",
            "/applicants": "/applicants.html",
            "/employer-dashboard": "/employer-dashboard.html",
            "/post-job": "/post-job.html",
            "/edit-job": "/edit-job.html"
        }

        path = urlparse(self.path).path

        if path in routes:
            self.path = routes[path]

        return super().do_GET()


os.chdir("/workspaces/jobnesthub")

server = ThreadingHTTPServer(
    ("0.0.0.0", 3000),
    JobNestHubHandler
)

print("JobNestHub website running on port 3000")

server.serve_forever()
