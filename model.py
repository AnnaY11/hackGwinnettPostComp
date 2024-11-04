import os
import numpy as np
import pandas as pd


import json
from flask import request
from flask import Flask, render_template
app = Flask(__name__)

# @app.route('/')
# def index():
#     return render_template('predict.html')

@app.route('/test', methods=['POST'])
def test():
    output = request.get_json()
    print(output)
    print(type(output))
    result = json.loads(output)
    print(result)
    print(type(result))
    dataset_train = pd.read_csv("Google_Stock_Price_Train.csv")
    dataset_train.head()

    print("hi")

    training_set = dataset_train.iloc[:, 1:2].values

    # print(training_set)
    # print(training_set.shape)

    from sklearn.preprocessing import MinMaxScaler

    scaler = MinMaxScaler(feature_range = (0,1))
    scaled_training_set = scaler.fit_transform(training_set)

    scaled_training_set

    dataset_test = pd.read_csv("Google_Stock_Price_Test.csv")
    actual_stock_price = dataset_test.iloc[:, 1:2].values

    dataset_total = pd.concat((dataset_train['Open'], dataset_test['Open']), axis = 0)
    inputs = np.array([result])

    inputs = inputs.reshape(-1,1)
    inputs = scaler.transform(inputs)

    X_test = inputs

    X_test = np.array(X_test)
    X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))



    import pickle
    with open("stock_predictor_model.pkl", 'rb') as file:  
        regressor = pickle.load(file)



    # evaluate model 
    y_predict = regressor.predict(X_test)
    predicted_stock_price = regressor.predict(X_test)
    predicted_stock_price = scaler.inverse_transform(predicted_stock_price)

    # check results
    name = predicted_stock_price[0][0].item()
    print("Predicted Price: ", name)
    return render_template('predict.html', name='name')

if __name__ == "__main__":
    app.run(debug=True)






