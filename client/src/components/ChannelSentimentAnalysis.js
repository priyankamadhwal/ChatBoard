import React, { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import Icon from "@material-ui/core/Icon";

const ChannelSentimentAnalysis = (props) => {
  const [sentiment, setSentiment] = useState(props.sentiment);

  useEffect(() => {
    setSentiment(props.sentiment);
  }, [props.sentiment]);

  return (
    <div className='channelSentimentContainer'>
      {sentiment ? (
        <div className='channelSentimentData'>
          <span className='channelSentimentHeading'>
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
            {sentiment.totalMessages > 0 ? (
              sentiment.positive > sentiment.neutral &&
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
              )
            ) : (
              <div>NO RECORDS!</div>
            )}
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default ChannelSentimentAnalysis;
