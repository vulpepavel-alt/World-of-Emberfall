# Server de test care NU lasa browserul sa tina fisierele in memorie.
#
# Cu http.server obisnuit am schimbat 199 de fisiere, am incarcat pagina
# si browserul mi-a servit vechea versiune din cache - o jumatate de ora
# cautand o greseala care nu exista.
import http.server, socketserver

class FaraCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

    def log_message(self, *a):
        pass

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(('', 8765), FaraCache) as s:
    s.serve_forever()
