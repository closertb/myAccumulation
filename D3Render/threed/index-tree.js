/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description: 树状图
 */
(function threed(selector, data) {
  var width = 500,
    height = 500;
  var cityJson = {
    "name": "中国",
    "children": [{
        "name": "浙江",
        "children": [{
            "name": "杭州"
          },
          {
            "name": "宁波"
          },
          {
            "name": "温州"
          },
          {
            "name": "绍兴"
          }
        ]
      },

      {
        "name": "广西",
        "children": [{
            "name": "桂林",
            "children": [{
                "name": "秀峰区"
              },
              {
                "name": "叠彩区"
              },
              {
                "name": "象山区"
              },
              {
                "name": "七星区"
              }
            ]
          },
          {
            "name": "南宁"
          },
          {
            "name": "柳州"
          },
          {
            "name": "防城港"
          }
        ]
      },

      {
        "name": "黑龙江",
        "children": [{
            "name": "哈尔滨"
          },
          {
            "name": "齐齐哈尔"
          },
          {
            "name": "牡丹江"
          },
          {
            "name": "大庆"
          }
        ]
      },

      {
        "name": "新疆",
        "children": [{
            "name": "乌鲁木齐"
          },
          {
            "name": "克拉玛依"
          },
          {
            "name": "吐鲁番"
          },
          {
            "name": "哈密"
          }
        ]
      }
    ]
  }
  var tree = d3.layout.tree()
    .size([width, height - 200])
    .separation(function (a, b) {
      return (a.parent == b.parent ? 1 : 2);
    });

  var diagonal = d3.svg.diagonal()
    .projection(function (d) {
      return [d.y, d.x];
    });

  var svg = d3.select(".module").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(40,0)");



  var nodes = tree.nodes(cityJson);
  var links = tree.links(nodes);

  var link = svg.selectAll(".link")
    .data(links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", diagonal);

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.y + "," + d.x + ")";
    })

  node.append("circle")
    .attr("r", 4.5);

  node.append("text")
    .attr("dx", function (d) {
      return d.children ? -8 : 8;
    })
    .attr("dy", 3)
    .style("text-anchor", function (d) {
      return d.children ? "end" : "start";
    })
    .text(function (d) {
      return d.name;
    });
})()