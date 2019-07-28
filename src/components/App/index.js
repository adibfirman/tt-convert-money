import React from "react";

import styles from "./styles.module.css";

const mapMoney = [100000, 50000, 20000, 10000, 5000, 2000, 1000, 500, 100, 50];
const minMoney = mapMoney[mapMoney.length - 1];

function App() {
  const [error, setError] = React.useState(false);
  const [listData, setListData] = React.useState();

  function convertMoney(str) {
    // test regex https://regex101.com/r/r4IFaG/2
    const isValid = new RegExp(/(\d+[.]\d+\d+)|(Rp\d.+)|(0+[1-9]+)/g).test(str);

    str = str.replace(/\./g, "");
    str = str.replace(/rp/gi, "");

    if (isValid) return parseFloat(str);
    else {
      if (Number(str)) return parseFloat(str);
      else return "invalid number";
    }
  }

  function handlesubmit(e) {
    e.preventDefault();
    setError(false);

    const { money } = e.target.elements;
    const moneyVal = money.value;
    const result = {};

    if (moneyVal) {
      let convertingMoney = convertMoney(moneyVal);
      let index = 0;

      if (Number(convertingMoney)) {
        if (convertingMoney < minMoney) result[convertingMoney] = "-";
        else {
          while (index !== mapMoney.length) {
            const getMoneyMap = mapMoney[index];
            const reduction = convertingMoney - getMoneyMap;

            if (reduction < 0) index += 1;
            else if (reduction > 0 || reduction === 0) {
              if (result[mapMoney[index]]) result[mapMoney[index]] += 1;
              else result[mapMoney[index]] = 1;

              convertingMoney -= getMoneyMap;
            }

            if (minMoney > reduction && reduction > 0) result[reduction] = "-";
          }
        }

        setListData(result);
      } else setError(true);
    }
  }

  return (
    <div className={styles.wrapper}>
      {error && <h5 className={styles.error}>invalid number</h5>}
      <form onSubmit={handlesubmit} className={styles.form}>
        <input
          placeholder="Masukkan Nilai"
          className={styles.input}
          type="text"
          name="money"
        />
        <button className={styles.button} type="submit">
          Hitung
        </button>
      </form>
      {listData && <ListOFMoney list={listData} />}
    </div>
  );
}

function ListOFMoney({ list }) {
  const sortList = Object.keys(list).sort((a, b) => b - a);

  return (
    <div className={styles.wrapperList}>
      {sortList.map((key, i) => (
        <React.Fragment key={i}>
          {Number(list[key]) ? (
            <div>
              {list[key]} <small>X</small> {key}
            </div>
          ) : (
            <div> left Rp{key} (no available fraction)</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default App;
