/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
(function tempModule(selector, data) {
  var loader = new THREE.FileLoader();
  loader.load('./js/app.json', function (text) {

    var player = new APP.Player();
    player.load(JSON.parse(text));
    player.setSize(window.innerWidth, window.innerHeight);
    player.play();

    document.body.appendChild(player.dom);

    window.addEventListener('resize', function () {
      player.setSize(window.innerWidth, window.innerHeight);
    });
  });
})()
