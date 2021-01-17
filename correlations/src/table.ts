import * as d3 from 'd3';
import * as chroma from 'chroma-js'

interface Datum {
    row: number,
    column: number,
    value: number
}

export class Table<T extends Datum> {
    onClick: (d: T) => void;
    data: T[]
    dim: number
    parentDiv: HTMLElement
    rows: string[]
    columns: string[]

    constructor(
        data: T[],
        onClick: (d: T) => void,
        parentDiv: HTMLElement,
        rows: string[],
        columns: string[]
    ) {
        this.onClick = onClick;
        this.data = data;
        this.columns = columns;
        this.rows = rows;
        this.parentDiv = parentDiv;
        const margin = {top: 100, bottom: 1, left: 100, right: 1};

        const width = this.parentDiv.scrollWidth * .9 - margin.left - margin.right
        const height = width;
        this.dim = height;

        const svg = d3.select(this.parentDiv).append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        const padding = .1;

        const x = d3.scaleBand<number>()
        .range([0, width])
        .paddingInner(padding)
        .paddingOuter(.1)
        .domain(d3.range(0, columns.length));

        const y = d3.scaleBand<number>()
        .range([0, height])
        .paddingInner(padding)
        .paddingOuter(.1)
        .domain(d3.range(0, rows.length));

        const c = chroma.scale(["#de6600", "white", "#007a7a"])
        .domain([-1,1]);

        const x_axis = d3.axisTop(y).tickFormat((d, i) => this.rows[i]).tickSizeOuter(0);
        const y_axis = d3.axisLeft(x).tickFormat((d,i) => this.columns[i]).tickSizeOuter(0);

        svg.append("g")
            .attr("class", "x_axis")
            .call(x_axis)
            .selectAll("text")
            .attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 9)
            .style('font-size', '20px')
            .style("text-anchor", "start");

        svg.append("g")
            .attr("class", "y_axis")
            .style('font-size', '20px')
            .call(y_axis);

        svg.selectAll('path')
            .style('stroke-width', '0px');
        svg.selectAll('line')
            .style('stroke-width', '0px');

        const groups = svg.selectAll("g.rect")
            .data(this.data, (d: T) => d.value)
            .enter().append("g").attr('class', 'rect')

        groups.append("rect")
            .attr("x", function(d){ return x(d.column)})
            .attr("y", function(d){ return y(d.row)})
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())
            .attr('rx', 4)
            .style("fill", (d) => c(d.value).hex())
            .style("opacity", 1);

        groups.append("text")
            .attr("x", function(d){ return x(d.column)+x.bandwidth()/2})
            .attr("y", function(d){ return y(d.row)+y.bandwidth()/2})
            .style('font-size', `${x.bandwidth()/3.8}px`)
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'middle')
            .text((d) => d.value.toFixed(2))
            .style("opacity", 1);

        svg.selectAll("g.rect")
            .on("mouseover", function(event, datum: T){
                d3.select(this).selectChildren()
                .transition()
                .duration(10)
                    .style('opacity', .5);
                document.body.style.cursor = 'pointer'
                })
            .on('mouseout', function(event, datum: T) {
                d3.select(this).selectChildren()
                .transition()
                .duration(50)
                .style('opacity', 1);
                document.body.style.cursor = 'default'
            })
            .on('click', (e: any, d: T) => {
                this.onClick(d)
            });
        window.addEventListener("resize", () => { this.update() });
    }

    update(): void {
        const margin = {top: 100, bottom: 1, left: 100, right: 1};

        const width = this.parentDiv.scrollWidth * .9 - margin.left - margin.right
        const height = width;
        this.dim = height;

        const svg = d3.select(this.parentDiv).selectAll("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .selectChild("g")
            .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        const padding = .1;

        const x = d3.scaleBand<number>()
            .range([0, width])
            .paddingInner(padding)
            .paddingOuter(.1)
            .domain(d3.range(this.rows.length));

        const y = d3.scaleBand<number>()
            .range([0, height])
            .paddingInner(padding)
            .paddingOuter(.1)
            .domain(d3.range(this.columns.length));

        const x_axis = d3.axisTop(y).tickFormat((d, i) => this.rows[i]).tickSizeOuter(0);
        const y_axis = d3.axisLeft(x).tickFormat((d,i) => this.columns[i]).tickSizeOuter(0);

        svg.select("g.x_axis")
            .call(x_axis)
            .selectAll("text")
            .attr("dy", ".35em")
            .attr("transform", "rotate(-90)")
            .attr("y", 0)
            .attr("x", 9)
            .style('font-size', '20px')
            .style("text-anchor", "start");

        svg.select("g.y_axis")
            .call(y_axis);

        const groups = svg.selectAll("g.rect")

        groups.selectAll("rect")
            .attr("x", function(d: Datum){ return x(d.column)})
            .attr("y", function(d: Datum){ return y(d.row)})
            .attr("width", x.bandwidth())
            .attr("height", y.bandwidth())

        groups.selectAll("text")
            .attr("x", function(d:Datum){ return x(d.column)+x.bandwidth()/2})
            .attr("y", function(d: Datum){ return y(d.row)+y.bandwidth()/2})
            .style('font-size', `${x.bandwidth()/3.8}px`)
    }
}

