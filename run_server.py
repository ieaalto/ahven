from tornado import web, ioloop
from secret_settings import COOKIE_SECRET
from web_handlers import *

import os


def make_app():
    return web.Application([
        (r"^/", IndexHandler),
        (r"^/classify/", ReceiveHandler)
    ], **{
        "template_path": "./templates/",
        "login_url": "/login/",
        "xsrf_cookies": False,
        'cookie_secret': COOKIE_SECRET,
        "debug": True,
        "static_path": os.path.join(os.path.dirname(__file__), 'static'),
        "static_url_prefix": "/resources/",
        "auto_load": False
    })

if __name__ == "__main__":
    app = make_app()
    app.listen(80)
    try:
        ioloop.IOLoop.current().start()
    except KeyboardInterrupt:
        ioloop.IOLoop.current().stop()
        print("Server stopped.")