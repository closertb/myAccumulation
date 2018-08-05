/**
 * Created by Molay on 15/10/30.
 */

WS.TriangleSphereAnimator = function (mesh, rho, phi, theta, speed) {
    this.mesh = mesh;
    this.rho = rho;
    this.phi = phi;
    this.theta = theta;
    this.speed = speed;
    this.t = Math.random();
    this.r = 0;

    //this.speed = 0.0001;
};

WS.TriangleSphereAnimator.prototype = {
    mesh: null,
    rho: 1,
    phi: 0,
    theta: 0,
    speed: 0.01,
    t: 0,
    animate: function () {
        if (this.mesh == null) return;
        this.t += this.speed;
        if (this.t >= 1) {
            this.t = 0;
            this.phi = this.phi + PI;
            this.theta = this.theta + DP;
            //this.speed = 0.0025 + Math.random() * 0.0025;
            //this.speed /= 1.5;
        }
        // grown only once
        this.r += this.speed * 3 * this.rho;
        if (this.r >= this.rho) {
            this.r = this.rho;
        }
        if (this.r < 0) this.r = 0;
        //var _rho = this.rho + Math.sin(this.t * DP) * 0.25;
        var _rho = this.r + Math.sin(this.t * DP) * 0.25;
        var _phi = this.phi + PI * this.t;
        var _theta = this.theta + DP * this.t;
        var v = WS.MathUtil.calculateSpherePosition(_rho, _phi, _theta);
        var uv = v.clone().normalize();
        this.mesh.position.copy(v);
        this.mesh.lookAt(uv);
    }
};