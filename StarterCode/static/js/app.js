//data url
bio_data_url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Get the JSON data and console log it
function init(){
  var bio_data=d3.select("#selDataset");

  d3.json(bio_data_url).then(function(data) {
      let subjects = data.names;
      console.log(subjects)
      //add all subject ids to dropdown
      subjects.forEach(function(subject) {
        bio_data.append("option")
          .text(subject)
          .property("value", subject)
      });
      //initialize display so first subject is displayed when dashboard opened
      let subject_id = subjects[0];
      demo_info(subject_id);
      bar_graph(subject_id);
      bubble_graph(subject_id);
  });

  
}

//Demographic info
function demo_info(sample){
  d3.json(bio_data_url).then(function(data) {
      let subjects = data.metadata;
      let subject_id = subjects.filter(function(test_subject){return test_subject.id==sample});
      let demographics = subject_id[0];

      d3.select("#sample-metadata").html("");
      Object.entries(demographics).forEach(function([key,value]){
          //capitalize first letter of key (source: https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript)
          key = key.charAt(0).toUpperCase() + key.slice(1)
          d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
      });

  });
}

//bar graph
function bar_graph(sample){
  d3.json(bio_data_url).then(function(data) {
      let subjects = data.samples;
      let subject_id = subjects.filter(test_subject => test_subject.id==sample)
      let sample_data = subject_id[0];
      
      //get the otu ids, labels, and values
      let otu_ids = sample_data.otu_ids;
      let otu_labels = sample_data.otu_labels;
      let sample_values = sample_data.sample_values;
      

      //generate bar graph
      let y_axis = otu_ids.slice(0,10).map(function(id){
          return `OTU ${id}`
      });

      let x_axis = sample_values.slice(0,10);
      let text_labels = otu_labels.slice(0,10);

      let bar_chart={
          //reverse order so highest level at top of graph
          y:y_axis.reverse(),
          x:x_axis.reverse(),
          text:text_labels.reverse(),
          type:"bar",
          orientation:"h",
          mode:"markers",
          
          marker:{
              color:x_axis,
              colorscale:"#FF4F00"
          }
      }

      let layout={
          margin: {
            t: 55,
            r: 25,
            l: 65,
            b: 25
          },
          title:`Test Subject ${sample}'s Top 10 Belly Button Bacteria`
      };
      
      let config = {responsive: true}

      Plotly.newPlot("bar",[bar_chart],layout,config);

  });
}


//Bubble graph function
function bubble_graph(sample){
  d3.json(bio_data_url).then(function(data) {
      let subjects = data.samples;
      let subject_id = subjects.filter(test_subject => test_subject.id==sample)
      let sample_data = subject_id[0];
      
      //get the otu ids, labels, and values
      let otu_ids = sample_data.otu_ids;
      let otu_labels = sample_data.otu_labels;
      let sample_values = sample_data.sample_values;
      

      //bubble graph
      let bubble_chart={
          y:sample_values,
          x:otu_ids,
          text:otu_labels,
          mode:"markers",
          marker:{
              size:sample_values,
              color:otu_ids,
              colorscale:"#FF4F00"
          }
      }

      let layout={
          margin: {
            t: 55,
            r: 35,
            l: 55,
            b: 65
          },
          title:`Test Subject ${sample}'s Bacteria Culture per Sample`,
          hovermode:"closest",
          xaxis:{title:"OTU ID"},
          yaxis:{title:"Sample Value"},
          
        
      };
      
      let config = {responsive: true}
      
      Plotly.newPlot("bubble",[bubble_chart],layout,config);

  });
}


// Function for updating dashboard
function new_subject(item){
  demo_info(item)
  bar_graph(item)
  bubble_graph(item)
}

init();