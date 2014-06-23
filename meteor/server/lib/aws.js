// AWS load balancer health check
// respond to /ping with a 200 "OK"
Router.map(function () {
    this.route('ping', { where: 'server', action: function () {
        this.response.writeHead(200, {'Content-Type': 'text/html'});
        this.response.end('OK');
    }});
});