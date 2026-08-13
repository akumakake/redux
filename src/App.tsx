import ServiceForm from './components/ServiceForm';
import ServiceList from './components/ServiceList';
import SearchFilter from './components/SearchFilter';
import FilterStats from './components/FilterStats';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Управление услугами</h1>
      
      <SearchFilter />
      <FilterStats />
      
      <hr className={styles.separator} />
      
      <ServiceForm />
      
      <hr className={styles.separator} />
      
      <ServiceList />
    </div>
  );
}

export default App;