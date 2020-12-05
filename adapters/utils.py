try:
    # Python 2.6-2.7 
    from HTMLParser import HTMLParser
except ImportError:
    # Python 3
    from html.parser import HTMLParser

def decode_html(text: str) -> str:
    h = HTMLParser()
    return h.unescape(text)
