/**
 * Title:
 * @author Mr Denzel
 * @create Date 2017-12-25 14:07
 * @version 1.0
 * Description:
 */
(function threed(selector, data) {
  console.log('df');
  const rectHeight = 25;
  const [width, height] = [300, 500];
  const dataSet = [250, 210, 170, 130, 90];
  const svg = d3.select(".module")
    .append('svg')
    .attr('width', width)
    .attr('height', height);
  console.log(svg);
  svg.selectAll("rect")
    .data(dataSet)
    .enter()
    .append('rect')
    .attr('x', 20)
    .attr('y', (d, i) => i * rectHeight)
    .attr('width', d => d)
    .attr('height', rectHeight - 2)
    .attr('fill', 'steelblue')
})()