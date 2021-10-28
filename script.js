const countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
const eduURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let countyData
let eduData

let canvas = d3.select('#canvas')

// create tooltip
let tooltip = d3.select('#tooltip')

function drawMap () {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            // d -> set of coordinates for drawing paths
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                // get county ID from county data and
                // find the corresponding edu % in edu data
                let countyID = countyDataItem['id']
                let county = eduData.find((item) => {
                    return item['fips'] === countyID
                })
                let percentage = county['bachelorsOrHigher']

                if (percentage <= 15) {
                    return '#c7e9c0'
                } else if (percentage <= 30) {
                    return '#a1d99b'
                } else if (percentage <= 45) {
                    return '#74c476'
                } else {
                    return '#238b45'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let countyID = countyDataItem['id']
                let county = eduData.find((item) => {
                    return item['fips'] === countyID
                })

                let percentage = county['bachelorsOrHigher']
                return percentage
            })
            .on('mouseover', (countyDataItem) => {
                tooltip.transition()
                        .style('visibility', 'visible')

                        let countyID = countyDataItem['id']
                        let county = eduData.find((item) => {
                            return item['fips'] === countyID
                        })

                tooltip.text(county['fips'] + ' - ' + county['area_name'] + ', ' + 
                            county['state'] + ': ' + county['bachelorsOrHigher'] + '%.')
                        .attr('data-education', county['bachelorsOrHigher'])
            })
            .on('mouseout', (countyDataItem) => {
                tooltip.transition()
                        .style('visibility', 'hidden');
            })
}

// fetching json data 
// returns a promise
d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(log)
        } else {
            // converting topojson into geojson as d3 can only work with geo
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            // fetching edu data only after(!) county data is fetched succesfully
            d3.json(eduURL).then(
                (data, error) => {
                    if(error) {
                        console.log(log)
                    } else {
                        eduData = data
                        console.log(eduData)
                        drawMap();
                    }
                }
            )
        }
    }
)
