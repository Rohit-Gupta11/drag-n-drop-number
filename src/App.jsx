import React, { useRef } from 'react';
import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  
  let [data, setData] = useState([]);
  let [result, setResult] = useState([]);
  let [operator, setOperator] = useState(['+', '-']);
  let [comparator, setComparator] = useState(['>', '<']);
  let [reload, setReload] = useState(false);
  let [dataStartIndex, setDataStartIndex] = useState();
  let [done, setDone] = useState(false);

  useEffect(() => {
    fetch('http://localhost:4000/allChar')
      .then(response => response.json())
      .then(data => { setData(data) });
    setDone(false);
    setReload(false)
  }, [reload]);

  function onDragStart(e, id) {
    e.dataTransfer.setData('id', id);
  }

  function onDragOver(e) {
    e.preventDefault();
  }

  function onDrop(e, cat) {
    let id = e.dataTransfer.getData('id');
    if (done) {
      if (id === 'int') {
        alert('Submit or Reaarange equation');
      }
    }
    //  else if (result.length === 0) {
    //   if (id === '+' || id === '-' || id === '<' || id === '>' || id === 'int') {
    //     alert('Insert an operand ( Alphabet Box ) first !!');
    //   } else {
    //     let tasks = data.filter((el) => {
    //       if (el._id !== id) {
    //         return el;
    //       } else {
    //         setResult(prev => [...prev, el]);
    //       }
    //     });
    //     setData(tasks);
    //   }
    // }
    else {
      if (id === '+' || id === '-' || id === '<' || id === '>') {
        // if (result[result.length - 1] === '+' || result[result.length - 1] === '-' || result[result.length - 1] === '<' || result[result.length - 1] === '>') {
        //   alert('Invalid input')
        // } else {
        setResult(prev => [...prev, id]);
        // }
      } else if (id === 'int') {
        if (typeof result[result.length - 1] === 'object') {
          alert('Invalid input')
        } else {
          let value = prompt('Please enter an integer');
          setResult(prev => [...prev, value]);
          setDone(true)
        }
      } else {
        // if (typeof result[result.length - 1] === 'object') {
        //   alert('Invalid input')
        // } else {
        let tasks = data.filter((el) => {
          if (el._id !== id) {
            return el;
          } else {
            setResult(prev => [...prev, el]);
          }
        });
        setData(tasks);
        // }
      }
    }
  }

  function onDoubleClick(e) {
    let id = e.target.getAttribute('data-index');
    let temp = [];
    let target;
    result.forEach((el, index) => {
      if(index != Number(id)){
        temp.push(el);
      } else {
        target = el;
      }
    });
    if (typeof target === typeof []){
      setData(prev => [target, ...prev]);
    } else if (Number.isInteger(Number(target))){
      setDone(false)
    }
    setResult(temp);
  }

  function dragStart(e) {
    let dragStartIndex = +e.target.closest('button').getAttribute('data-index');
    console.log('start', dataStartIndex)
    setDataStartIndex(dragStartIndex);
  }

  function dragEnter(e) {
    e.target.classList.add('over');
  }

  function dragLeave(e) {
    e.target.classList.remove('over');
  }

  function dragDrop(e) {
    const dragEndIndex = +e.target.getAttribute('data-index');
    console.log('ends', dragEndIndex);
    swapItems(dataStartIndex, dragEndIndex);

    e.target.classList.remove('over');
  }

  function swapItems(fromIndex, toIndex) {
    if (fromIndex !== undefined) {
      let tasks = [];
      result.forEach((el, index) => {
        if(index != fromIndex){
          tasks.push(el);
        }
      });
      tasks.splice(toIndex,0,result[fromIndex]);
      setResult(tasks);
    }
  }

  return (
    <div className="App">
      <div className='container-drag'>
        {
          data && data.map(item => {
            return <button
              className='alpha-btn'
              key={item._id}
              value={item.value}
              onDragStart={(e) => onDragStart(e, item._id)}
              draggable
            >{item.character}</button>
          })
        }
      </div>

      <div className='container-drag operator-drag'>
        <div className='operator-field'>
          {operator && operator.map(op => {
            return <button
              className='op-btn'
              key={op}
              value={op}
              draggable
              onDragStart={(e) => onDragStart(e, op)}
            >{op}</button>
          })}
        </div>
        <div className='operator-field'>
          {comparator && comparator.map(op => {
            return <button
              className='op-btn'
              key={op}
              value={op}
              draggable
              onDragStart={(e) => onDragStart(e, op)}
            >{op}</button>
          })}
        </div>
        <button
          className='int-btn'
          draggable
          onDragStart={(e) => onDragStart(e, 'int')
          }>int</button>
      </div>

      <div
        className='result-area'
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => { onDrop(e, 'in-tray') }}
      >
        {result && result.map((el, index) => {

          if (el._id) {
            return <button
              className='alpha-btn draggable'
              key={el._id}
              value={el.value}
              draggable
              data-index={index}
              onDoubleClick={(e) => onDoubleClick(e)}
              onDragStart={(e) => dragStart(e)}
              onDragEnter={(e) => dragEnter(e)}
              onDragLeave={(e) => dragLeave(e)}
              onDrop={(e) => dragDrop(e)}
            >{el.character}</button>
          }
          else if (el === '+' || el === '-' || el === '>' || el === '<') {
            return <button
              className='op-btn draggable'
              key={uuidv4()}
              value={el}
              onDoubleClick={(e) => onDoubleClick(e)}
              draggable
              data-index={index}
              onDragStart={(e) => dragStart(e)}
              onDragEnter={(e) => dragEnter(e)}
              onDragLeave={(e) => dragLeave(e)}
              onDrop={(e) => dragDrop(e)}
            >{el}</button>
          } else {
            return <button
              className='int-btn draggable'
              key={el}
              value={el}
              onDoubleClick={(e) => onDoubleClick(e)}
              data-index={index}
              draggable
              onDragStart={(e) => dragStart(e)}
              onDragEnter={(e) => dragEnter(e)}
              onDragLeave={(e) => dragLeave(e)}
              onDrop={(e) => dragDrop(e)}
            >{el}</button>
          }
        })}
      </div>

      <div className="submit-container">
        <button className='submit' onClick={() => {
          let str = '';
          result.forEach(el => {
            if (typeof el === 'string') {
              str += el;
            } else {
              str += el.value;
            }
          });
          alert(eval(str));
          setReload(true);
          setResult([])
        }}>Submit</button>
      </div>
      <p>Double Click to remove back item.</p>
    </div>
  );
}

export default App;
