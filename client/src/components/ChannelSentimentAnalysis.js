import React from "react";
import { Doughnut } from "react-chartjs-2";
import Icon from "@material-ui/core/Icon";

import { GET } from "../utils/api";

const SentimentAnalysis = (props) => {
  const [sentiment, setSentiment] = React.useState(props.sentiment);

  React.useEffect(() => {
    setSentiment(props.sentiment);
  }, [props.sentiment]);

  return (
    <div className='sentimentAnalysisOuterContainer'>
      {sentiment ? (
        <div className='sentimentAnalysisData'>
          <span className='sentimentAnalysisHeading'>
            Sentiment Distribution
          </span>
          <div className='channelSentimentTotalMessages'>
            {"Total Messages : " + sentiment.totalMessages}
          </div>
          <Doughnut
            data={{
              labels: ["Positive", "Neutral", "Negative"],
              datasets: [
                {
                  data: [
                    sentiment.positive,
                    sentiment.neutral,
                    sentiment.negative,
                  ],
                  backgroundColor: ["#5BE12C", "#F5CD19", "#EA4228"],
                },
              ],
            }}
            height={200}
          />
          <div className='channelOverallSentiment'>
            {sentiment.positive > sentiment.neutral &&
            sentiment.positive > sentiment.negative ? (
              <div>
                <div>POSITIVE</div> <Icon className='fas fa-grin' />
              </div>
            ) : sentiment.neutral > sentiment.negative ? (
              <div>
                <div>NEUTRAL</div> <Icon className='fas fa-meh' />
              </div>
            ) : (
              <div>
                <div>NEGATIVE</div> <Icon className='fas fa-frown-open' />
              </div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default SentimentAnalysis;
