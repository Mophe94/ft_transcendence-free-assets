FROM fluent/fluent-bit:2.2

COPY fluent-bit.conf /fluent-bit/etc/
COPY parser.conf /fluent-bit/etc/

CMD ["/fluent-bit/bin/fluent-bit", "-c", "/fluent-bit/etc/fluent-bit.conf"]
