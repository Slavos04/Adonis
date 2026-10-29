import React, { useState, useEffect } from 'react';
import { authApi, measurementsApi, dietPlansApi, recipesApi } from '../api/client';
import { ChatWidget } from '../components/ChatWidget';
import RecommendationsHistoryModal from '../components/RecommendationsHistoryModal';
import { PortionScalerModal } from '../components/PortionScalerModal';
import { MonthlyMeasurementChart } from '../components/MonthlyMeasurementChart';
import { PdfImportModal } from '../components/PdfImportModal';
import { RecipeDeleteModal } from '../components/RecipeDeleteModal';
import { APP_VERSION } from '../version';

import {
  Users, UserCheck, ShieldAlert, FileText, Calendar, Plus,
  Edit3, History, Save, Send, Utensils, Award, Layers, Sparkles,
  Trash2, AlertTriangle, Check, Upload, Image, Calculator, Flame,
  Search, Info, BookOpen, Clock, ChevronRight, Package, Eye, TrendingDown
} from 'lucide-react';


const POLISH_DAYS = [
  'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota', 'Niedziela'
];

function getStoreBadgeClass(store) {
  const s = (store || '').toLowerCase();
  if (s === 'lidl') return 'badge-lidl';
  if (s === 'biedronka') return 'badge-biedronka';
  if (s === 'kaufland') return 'badge-kaufland';
  if (s === 'carrefour') return 'badge-carrefour';
  return 'badge-emerald';
}

export function DietitianDashboard() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientProfile, setSelectedPatientProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('packages'); // 'packages' | 'crud' | 'goals' | 'audit' | 'chat'
  const [loading, setLoading] = useState(true);
  const [inspectingRecipeId, setInspectingRecipeId] = useState(null);

  // Recipes & Products state
  const [recipes, setRecipes] = useState([]);
  const [products, setProducts] = useState([]);
  const [recipesMap, setRecipesMap] = useState({});

  // Templates / Packages state
  const [templates, setTemplates] = useState([]);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('Wszystkie');
  const [customGroups, setCustomGroups] = useState(() => {
    try {
      const saved = localStorage.getItem('adonis_custom_diet_groups');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showAddGroupInput, setShowAddGroupInput] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPdfImportModal, setShowPdfImportModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [templateToSend, setTemplateToSend] = useState(null);
  const [sendStartDate, setSendStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [sendPatientId, setSendPatientId] = useState('');
  const [sendNotes, setSendNotes] = useState('');
  const [sendFeedback, setSendFeedback] = useState(null);

  // Package Creator state
  const [tplName, setTplName] = useState('');
  const [tplCategory, setTplCategory] = useState('Bez grupy');
  const [tplDescription, setTplDescription] = useState('');
  const [tplTargetCalories, setTplTargetCalories] = useState(1800);
  const [tplMealsPerDay, setTplMealsPerDay] = useState(4);
  const [tplActiveDayIdx, setTplActiveDayIdx] = useState(0); // 0..6
  const [tplDaysData, setTplDaysData] = useState([]);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [splitLunch, setSplitLunch] = useState(false);
  const [expandedTemplateId, setExpandedTemplateId] = useState(null);

  // CRUD Recipes & Products state
  const [crudSubTab, setCrudSubTab] = useState('recipes');
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const [showRecipeDeleteModal, setShowRecipeDeleteModal] = useState(false);

  function promptDeleteRecipe(recipe) {
    setRecipeToDelete(recipe);
    setShowRecipeDeleteModal(true);
  } // 'recipes' | 'products'
  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [recipeFormTitle, setRecipeFormTitle] = useState('');
  const [recipeFormCategory, setRecipeFormCategory] = useState('Obiad');
  const [recipeFormPrepTime, setRecipeFormPrepTime] = useState(25);
  const [recipeFormPortions, setRecipeFormPortions] = useState(1.0);
  const [recipeFormImageUrl, setRecipeFormImageUrl] = useState('');
  const [recipeFormInstructions, setRecipeFormInstructions] = useState('');
  const [recipeFormIngredients, setRecipeFormIngredients] = useState([]); // [{ product_id, amount_g }]
  const [imageUploading, setImageUploading] = useState(false);

  // CRUD Product modal
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormName, setProductFormName] = useState('');
  const [productFormStore, setProductFormStore] = useState('Lidl');
  const [productFormBrand, setProductFormBrand] = useState('');
  const [productFormBarcode, setProductFormBarcode] = useState('');
  const [productFormKcal, setProductFormKcal] = useState(100);
  const [productFormProtein, setProductFormProtein] = useState(10);
  const [productFormFat, setProductFormFat] = useState(2);
  const [productFormCarbs, setProductFormCarbs] = useState(15);
  const [productFormUnit, setProductFormUnit] = useState('g');
  const [productFormCategory, setProductFormCategory] = useState('Nabiał');

  // Patient Goals & Recommendations state
  const [dailyCalories, setDailyCalories] = useState(2000);
  const [proteinG, setProteinG] = useState(140);
  const [fatG, setFatG] = useState(60);
  const [carbsG, setCarbsG] = useState(220);
  const [mealsPerDay, setMealsPerDay] = useState(4);
  const [recommendations, setRecommendations] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showRecModal, setShowRecModal] = useState(false);


  // Measurements & Audit state
  const [measurements, setMeasurements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [editingMeasurement, setEditingMeasurement] = useState(null);
  const [correctWeight, setCorrectWeight] = useState('');
  const [correctReason, setCorrectReason] = useState('');

  // Search filters
  const [recipeSearch, setRecipeSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    setLoading(true);
    try {
      const [patientsData, recipesData, productsData, templatesData] = await Promise.all([
        authApi.getPatients(),
        recipesApi.list({ limit: 1000 }),
        recipesApi.products({ limit: 1000 }),
        dietPlansApi.getTemplates(),
      ]);

      setPatients(patientsData);
      if (patientsData.length > 0) {
        selectPatient(patientsData[0]);
        setSendPatientId(patientsData[0].id.toString());
      }

      setRecipes(recipesData);
      const rMap = {};
      recipesData.forEach((r) => { rMap[r.id] = r; });
      setRecipesMap(rMap);

      setProducts(productsData);
      setTemplates(templatesData);
    } catch (err) {
      console.error('Błąd ładowania danych początkowych:', err);
    } finally {
      setLoading(false);
    }
  }

  async function refreshTemplates() {
    try {
      const data = await dietPlansApi.getTemplates();
      setTemplates(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function refreshRecipesAndProducts() {
    try {
      const [rData, pData] = await Promise.all([
        recipesApi.list({ limit: 1000 }),
        recipesApi.products({ limit: 1000 }),
      ]);
      setRecipes(rData);
      const rMap = {};
      rData.forEach((r) => { rMap[r.id] = r; });
      setRecipesMap(rMap);
      setProducts(pData);
    } catch (err) {
      console.error(err);
    }
  }

  async function selectPatient(patient) {
    setSelectedPatient(patient);
    setSaveSuccess(false);
    try {
      const [mList, aList, pData] = await Promise.all([
        measurementsApi.list(patient.id),
        measurementsApi.getAuditLogs(patient.id),
        authApi.getPatientProfile(patient.id).catch(() => null),
      ]);
      setMeasurements(mList);
      setAuditLogs(aList);
      if (pData && pData.profile) {
        setSelectedPatientProfile(pData.profile);
        setDailyCalories(pData.profile.daily_calories_goal || 2000);
        setProteinG(pData.profile.protein_goal_g || 140);
        setFatG(pData.profile.fat_goal_g || 60);
        setCarbsG(pData.profile.carbs_goal_g || 220);
        setMealsPerDay(pData.profile.meals_per_day || 4);
        setRecommendations(pData.profile.official_recommendations || '');
        setBirthYear(pData.profile.birth_year || '');
      } else {
        setSelectedPatientProfile(null);
        setBirthYear('');
      }
    } catch (_) {}
  }

  // --- PACKAGE CREATOR & EDITOR METHODS ---
  function buildMealTypes(mealsCount, isSplitLunch) {
    const count = parseInt(mealsCount) || 4;
    if (count === 3) {
      return isSplitLunch
        ? ['Śniadanie', 'Obiad (I danie - zupa)', 'Obiad (II danie)', 'Kolacja']
        : ['Śniadanie', 'Obiad', 'Kolacja'];
    }
    if (count === 4) {
      return isSplitLunch
        ? ['Śniadanie', 'Drugie śniadanie', 'Obiad (I danie - zupa)', 'Obiad (II danie)', 'Kolacja']
        : ['Śniadanie', 'Drugie śniadanie', 'Obiad', 'Kolacja'];
    }
    // 5 posiłków
    return isSplitLunch
      ? ['Śniadanie', 'Drugie śniadanie', 'Obiad (I danie - zupa)', 'Obiad (II danie)', 'Podwieczorek', 'Kolacja']
      : ['Śniadanie', 'Drugie śniadanie', 'Obiad', 'Podwieczorek', 'Kolacja'];
  }

  function generateDaysData(mealTypes) {
    const defaultBreakfast = recipes.find((r) => r.category === 'Śniadanie')?.id || recipes[0]?.id;
    const defaultSecond = recipes.find((r) => r.category === 'Drugie śniadanie')?.id || recipes[0]?.id;
    const defaultLunch = recipes.find((r) => r.category === 'Obiad')?.id || recipes[0]?.id;
    const defaultSnack = recipes.find((r) => r.category === 'Przekąska')?.id || recipes[0]?.id;
    const defaultDinner = recipes.find((r) => r.category === 'Kolacja')?.id || recipes[0]?.id;

    const getRecipeForType = (type) => {
      if (type.includes('Śniadanie') && !type.includes('Drugie')) return defaultBreakfast;
      if (type.includes('Drugie śniadanie')) return defaultSecond;
      if (type.includes('Obiad')) return defaultLunch;
      if (type.includes('Podwieczorek') || type.includes('Przekąska')) return defaultSnack;
      if (type.includes('Kolacja')) return defaultDinner;
      return recipes[0]?.id;
    };

    return POLISH_DAYS.map((dayName, idx) => ({
      day_number: idx + 1,
      day_name: dayName,
      meals: mealTypes.map((mType) => ({
        meal_type: mType,
        recipe_id: getRecipeForType(mType),
        portions: 1.0,
      })),
    }));
  }

  function initNewPackage() {
    setEditingTemplate(null);
    setTplName('');
    setTplCategory('Bez grupy');
    setTplDescription('');
    setTplTargetCalories(1800);
    setTplMealsPerDay(4);
    setSplitLunch(false);
    setTplActiveDayIdx(0);
    const types = buildMealTypes(4, false);
    setTplDaysData(generateDaysData(types));
    setShowTemplateModal(true);
  }

  function openEditPackageModal(tpl) {
    setEditingTemplate(tpl);
    setTplName(tpl.name);
    setTplCategory(tpl.category);
    setTplDescription(tpl.description || '');
    setTplTargetCalories(tpl.target_calories);
    setTplMealsPerDay(tpl.meals_per_day);
    const hasSplit = tpl.days_data?.some((d) =>
      d.meals?.some((m) => m.meal_type?.includes('I danie') || m.meal_type?.includes('II danie'))
    );
    setSplitLunch(Boolean(hasSplit));
    setTplActiveDayIdx(0);
    setTplDaysData(JSON.parse(JSON.stringify(tpl.days_data || [])));
    setShowTemplateModal(true);
  }

  function handleTplMealsPerDayChange(count) {
    const num = parseInt(count);
    setTplMealsPerDay(num);
    const types = buildMealTypes(num, splitLunch);
    // Regenerate structure for each day preserving existing selections where possible
    const updated = tplDaysData.map((d) => {
      const newMeals = types.map((mType, idx) => {
        const existing = d.meals[idx];
        return {
          meal_type: mType,
          recipe_id: existing ? existing.recipe_id : (recipes[0]?.id || 1),
          portions: existing ? existing.portions : 1.0,
        };
      });
      return { ...d, meals: newMeals };
    });
    setTplDaysData(updated);
  }

  function handleSplitLunchToggle(checked) {
    setSplitLunch(checked);
    const types = buildMealTypes(tplMealsPerDay, checked);
    const updated = tplDaysData.map((d) => {
      const newMeals = types.map((mType, idx) => {
        const existing = d.meals[idx];
        return {
          meal_type: mType,
          recipe_id: existing ? existing.recipe_id : (recipes[0]?.id || 1),
          portions: existing ? existing.portions : 1.0,
        };
      });
      return { ...d, meals: newMeals };
    });
    setTplDaysData(updated);
  }

  function updateTplMeal(dayIdx, mealIdx, field, value) {
    setTplDaysData((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[dayIdx].meals[mealIdx][field] = value;
      return copy;
    });
  }

  function copyCurrentDayToAllDays() {
    const currentDayMeals = JSON.parse(JSON.stringify(tplDaysData[tplActiveDayIdx].meals));
    setTplDaysData((prev) =>
      prev.map((d) => ({
        ...d,
        meals: JSON.parse(JSON.stringify(currentDayMeals)),
      }))
    );
    alert('Zestaw dań z aktywnego dnia został skopiowany na wszystkie 7 dni tygodnia!');
  }

  function calculateDayNutrition(dayIdx) {
    const day = tplDaysData[dayIdx];
    if (!day) return { cal: 0, p: 0, f: 0, c: 0 };
    let cal = 0, p = 0, f = 0, c = 0;
    day.meals.forEach((m) => {
      const rec = recipesMap[m.recipe_id];
      if (rec) {
        const mult = parseFloat(m.portions || 1.0) / (parseFloat(rec.default_portions) || 1.0);
        cal += parseFloat(rec.calories || 0) * mult;
        p += parseFloat(rec.protein_g || 0) * mult;
        f += parseFloat(rec.fat_g || 0) * mult;
        c += parseFloat(rec.carbs_g || 0) * mult;
      }
    });
    return {
      cal: Math.round(cal),
      p: Math.round(p * 10) / 10,
      f: Math.round(f * 10) / 10,
      c: Math.round(c * 10) / 10,
    };
  }

  async function handleSavePackage(e) {
    e.preventDefault();
    if (!tplName.trim()) {
      alert('Proszę podać nazwę pakietu diety.');
      return;
    }
    try {
      const payload = {
        name: tplName,
        category: tplCategory,
        description: tplDescription,
        target_calories: parseInt(tplTargetCalories),
        meals_per_day: parseInt(tplMealsPerDay),
        days_data: tplDaysData,
      };
      if (editingTemplate) {
        await dietPlansApi.updateTemplate(editingTemplate.id, payload);
        alert(`Pakiet diety "${tplName}" został pomyślnie zaktualizowany!`);
      } else {
        await dietPlansApi.createTemplate(payload);
        alert(`Pakiet diety "${tplName}" został pomyślnie utworzony!`);
      }
      setShowTemplateModal(false);
      setEditingTemplate(null);
      refreshTemplates();
    } catch (err) {
      alert(`Błąd zapisu pakietu: ${err.message}`);
    }
  }


  async function handleDeleteTemplate(id, name) {
    if (!window.confirm(`Czy na pewno chcesz usunąć pakiet "${name}"?`)) return;
    try {
      await dietPlansApi.deleteTemplate(id);
      refreshTemplates();
    } catch (err) {
      alert(`Błąd usuwania: ${err.message}`);
    }
  }

  function openSendPackageModal(tpl) {
    setTemplateToSend(tpl);
    setSendStartDate(new Date().toISOString().split('T')[0]);
    setSendNotes(`Plan wdrożony z pakietu: ${tpl.name} (${tpl.category})`);
    setSendFeedback(null);
    setShowSendModal(true);
  }

  async function handleSendPackageToPatient(e) {
    e.preventDefault();
    if (!templateToSend || !sendPatientId) return;
    try {
      const res = await dietPlansApi.sendTemplateToPatient(templateToSend.id, {
        patient_id: parseInt(sendPatientId),
        start_date: sendStartDate,
        notes: sendNotes,
      });
      setSendFeedback(res.message);
      setTimeout(() => {
        setShowSendModal(false);
        setSendFeedback(null);
      }, 2500);
    } catch (err) {
      alert(`Błąd wysyłania pakietu: ${err.message}`);
    }
  }

  // --- CRUD RECIPES / PRODUCTS METHODS ---
  function openCreateRecipeModal() {
    setEditingRecipe(null);
    setRecipeFormTitle('');
    setRecipeFormCategory('Obiad');
    setRecipeFormPrepTime(25);
    setRecipeFormPortions(1.0);
    setRecipeFormImageUrl('');
    setRecipeFormInstructions('1. Przygotuj świeże składniki z Lidla/Biedronki.\n2. Pokrój i podduś na małej ilości oliwy.\n3. Dopraw ziołami i podawaj na ciepło.');
    setRecipeFormIngredients([
      { product_id: products[0]?.id || 1, amount_g: 150 },
      { product_id: products[1]?.id || 2, amount_g: 50 },
    ]);
    setShowRecipeModal(true);
  }

  async function openEditRecipeModal(recipe) {
    setEditingRecipe(recipe);
    setRecipeFormTitle(recipe.title);
    setRecipeFormCategory(recipe.category);
    setRecipeFormPrepTime(recipe.preparation_time_minutes || 20);
    setRecipeFormPortions(recipe.default_portions || 1.0);
    setRecipeFormImageUrl(recipe.image_url || '');
    setRecipeFormInstructions(recipe.instructions || '');
    setShowRecipeModal(true);

    try {
      const full = await recipesApi.get(recipe.id);
      if (full.instructions) setRecipeFormInstructions(full.instructions);
      const ings = (full.ingredients || []).map((i) => ({
        product_id: i.product?.id || i.product_id,
        amount_g: i.amount_g,
        unit: i.unit || 'g',
      }));
      setRecipeFormIngredients(ings);
    } catch (_) {
      if (recipe.ingredients) {
        setRecipeFormIngredients(recipe.ingredients.map((i) => ({
          product_id: i.product?.id || i.product_id,
          amount_g: i.amount_g,
          unit: i.unit || 'g',
        })));
      }
    }
  }

  async function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    setImageUploading(true);
    try {
      const data = await recipesApi.uploadImage(file);
      setRecipeFormImageUrl(data.image_url);
    } catch (err) {
      alert(`Błąd wgrywania zdjęcia: ${err.message}`);
    } finally {
      setImageUploading(false);
    }
  }

  async function handleSaveRecipe(e) {
    e.preventDefault();
    if (!recipeFormTitle.trim()) return;

    try {
      const ingredientsPayload = recipeFormIngredients.map((i) => ({
        product_id: parseInt(i.product_id),
        amount_g: parseFloat(i.amount_g) || 0,
      }));

      if (editingRecipe) {
        await recipesApi.update(editingRecipe.id, {
          title: recipeFormTitle,
          category: recipeFormCategory,
          preparation_time_minutes: parseInt(recipeFormPrepTime),
          instructions: recipeFormInstructions,
          default_portions: parseFloat(recipeFormPortions),
          image_url: recipeFormImageUrl,
          ingredients: ingredientsPayload,
        });
        alert('Przepis oraz składniki zostały pomyślnie zaktualizowane!');
      } else {
        await recipesApi.create({
          title: recipeFormTitle,
          category: recipeFormCategory,
          preparation_time_minutes: parseInt(recipeFormPrepTime),
          instructions: recipeFormInstructions,
          default_portions: parseFloat(recipeFormPortions),
          image_url: recipeFormImageUrl,
          ingredients: ingredientsPayload,
        });
        alert('Nowy przepis został dodany do bazy Adonis!');
      }
      setShowRecipeModal(false);
      refreshRecipesAndProducts();
    } catch (err) {
      alert(`Błąd zapisu przepisu: ${err.message}`);
    }
  }

  async function handleDeleteRecipe(id, title) {
    if (!window.confirm(`Czy na pewno usunąć przepis "${title}"?`)) return;
    try {
      await recipesApi.delete(id);
      refreshRecipesAndProducts();
    } catch (err) {
      alert(`Błąd usuwania przepisu: ${err.message}`);
    }
  }

  function openCreateProductModal() {
    setEditingProduct(null);
    setProductFormName('');
    setProductFormStore('Lidl');
    setProductFormBrand('');
    setProductFormBarcode('');
    setProductFormKcal(85);
    setProductFormProtein(12);
    setProductFormFat(1.5);
    setProductFormCarbs(4.0);
    setProductFormUnit('g');
    setProductFormCategory('Nabiał');
    setShowProductModal(true);
  }

  function openEditProductModal(prod) {
    setEditingProduct(prod);
    setProductFormName(prod.name);
    setProductFormStore(prod.store);
    setProductFormBrand(prod.brand || '');
    setProductFormBarcode(prod.barcode || '');
    setProductFormKcal(prod.calories_per_100g);
    setProductFormProtein(prod.protein_per_100g);
    setProductFormFat(prod.fat_per_100g);
    setProductFormCarbs(prod.carbs_per_100g);
    setProductFormUnit(prod.unit);
    setProductFormCategory(prod.category);
    setShowProductModal(true);
  }

  async function handleSaveProduct(e) {
    e.preventDefault();
    if (!productFormName.trim()) return;

    try {
      const payload = {
        name: productFormName,
        store: productFormStore,
        brand: productFormBrand,
        barcode: productFormBarcode || null,
        calories_per_100g: parseFloat(productFormKcal),
        protein_per_100g: parseFloat(productFormProtein),
        fat_per_100g: parseFloat(productFormFat),
        carbs_per_100g: parseFloat(productFormCarbs),
        unit: productFormUnit,
        category: productFormCategory,
      };

      if (editingProduct) {
        await recipesApi.updateProduct(editingProduct.id, payload);
        alert('Produkt został zaktualizowany!');
      } else {
        await recipesApi.createProduct(payload);
        alert('Nowy produkt z dyskontu dodany do bazy!');
      }
      setShowProductModal(false);
      refreshRecipesAndProducts();
    } catch (err) {
      alert(`Błąd zapisu produktu: ${err.message}`);
    }
  }

  async function handleDeleteProduct(id, name) {
    if (!window.confirm(`Czy na pewno usunąć produkt "${name}"?`)) return;
    try {
      await recipesApi.deleteProduct(id);
      refreshRecipesAndProducts();
    } catch (err) {
      alert(`Błąd usuwania produktu: ${err.message}`);
    }
  }

  // --- GOALS & RECOMMENDATIONS ---
  async function handleSaveGoals(e) {
    e.preventDefault();
    if (!selectedPatient) return;
    try {
      await authApi.updatePatientProfile(selectedPatient.id, {
        daily_calories_goal: parseInt(dailyCalories),
        protein_goal_g: parseFloat(proteinG),
        fat_goal_g: parseFloat(fatG),
        carbs_goal_g: parseFloat(carbsG),
        meals_per_day: parseInt(mealsPerDay),
        official_recommendations: recommendations,
        birth_year: birthYear ? parseInt(birthYear) : null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(`Błąd: ${err.message}`);
    }
  }

  // --- AUDIT LOG WEIGHT CORRECTION ---
  async function handleCorrectMeasurement(e) {
    e.preventDefault();
    if (!editingMeasurement || !correctWeight) return;
    try {
      await measurementsApi.correctByDietitian(editingMeasurement.id, {
        weight: parseFloat(correctWeight),
        reason: correctReason || 'Korekta błędu pomiarowego przez dietetyka',
      });
      setEditingMeasurement(null);
      setCorrectWeight('');
      setCorrectReason('');
      const [mList, aList] = await Promise.all([
        measurementsApi.list(selectedPatient.id),
        measurementsApi.getAuditLogs(selectedPatient.id),
      ]);
      setMeasurements(mList);
      setAuditLogs(aList);
      alert('Korekta pomiaru została zarejestrowana w Audit Logu!');
    } catch (err) {
      alert(`Błąd korekty: ${err.message}`);
    }
  }

  // Grupy diety i dynamiczne filtrowanie
  function handleAddGroup(e) {
    if (e && e.preventDefault) e.preventDefault();
    const name = newGroupName.trim();
    if (!name) return;
    if (!customGroups.includes(name)) {
      const updated = [...customGroups, name];
      setCustomGroups(updated);
      try {
        localStorage.setItem('adonis_custom_diet_groups', JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
    }
    setSelectedCategoryFilter(name);
    setNewGroupName('');
    setShowAddGroupInput(false);
  }

  const templateCategories = Array.from(new Set(templates.map(t => (t.category || '').trim()).filter(Boolean)));
  const baseDefaultGroups = ['Dieta redukcyjna', 'Dieta niskokaloryczna', 'Dieta wysokobiałkowa', 'Niski indeks glikemiczny', 'Dieta wegetariańska'];
  const allDietGroups = Array.from(new Set([...templateCategories.filter(g => g !== 'Bez grupy'), ...baseDefaultGroups, ...customGroups]));
  const categoryFilterOptions = ['Wszystkie', 'Bez grupy', ...allDietGroups];

  const filteredTemplates = templates.filter((tpl) => {
    if (selectedCategoryFilter === 'Wszystkie') return true;
    const tplCat = (tpl.category || '').trim().toLowerCase();
    if (selectedCategoryFilter === 'Bez grupy') {
      return !tplCat || tplCat === 'bez grupy' || tplCat === 'brak';
    }
    return tplCat === selectedCategoryFilter.toLowerCase();
  });

  const activeDayMacros = tplDaysData.length > 0 ? calculateDayNutrition(tplActiveDayIdx) : { cal: 0, p: 0, f: 0, c: 0 };
  const targetCal = tplTargetCalories || 1800;
  const isOverCal = activeDayMacros.cal > targetCal;
  const calDifference = activeDayMacros.cal - targetCal;

  return (
    <div className="page-container">
      {/* Top Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Award size={26} color="#10b981" />
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Panel Główny Dietetyka Adonis</h1>
              <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 700 }}>v{APP_VERSION}</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Pakiety diet tygodniowych, kalkulator wartości odżywczych, edycja dań ze zdjęciami oraz opieka nad pacjentami.
            </p>
          </div>

          {/* Patient Quick Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              background: 'rgba(255,255,255,0.03)',
              padding: '0.6rem 1.15rem',
              borderRadius: '12px',
              border: '1px solid var(--border-subtle)',
              minWidth: '340px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.5rem', borderRadius: '10px', flexShrink: 0 }}>
              <Users size={20} color="#10b981" />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Aktywny pacjent
              </div>
              <select
                value={selectedPatient?.id || ''}
                onChange={(e) => {
                  const p = patients.find((pat) => pat.id === parseInt(e.target.value));
                  if (p) selectPatient(p);
                }}
                style={{
                  width: '100%',
                  background: '#1f2937',
                  border: '1px solid var(--border-subtle)',
                  color: '#fff',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  marginTop: '0.2rem',
                }}
              >
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.first_name} {p.last_name} ({p.email})
                  </option>
                ))}
              </select>
              {selectedPatientProfile?.birth_year && (
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.2rem', display: 'block' }}>
                  Wiek: {new Date().getFullYear() - selectedPatientProfile.birth_year} lat (ur. {selectedPatientProfile.birth_year})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs-nav" style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            className={`tab-btn ${activeTab === 'packages' ? 'active' : ''}`}
            onClick={() => setActiveTab('packages')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Layers size={16} /> Pakiety Diet & Kreator Tygodniowy
          </button>
          <button
            className={`tab-btn ${activeTab === 'crud' ? 'active' : ''}`}
            onClick={() => setActiveTab('crud')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Utensils size={16} /> Kreator Przepisów & Baza Produktów
          </button>
          <button
            className={`tab-btn ${activeTab === 'goals' ? 'active' : ''}`}
            onClick={() => setActiveTab('goals')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <FileText size={16} /> Cele i Rekomendacje Pacjenta
          </button>
          <button
            className={`tab-btn ${activeTab === 'audit' ? 'active' : ''}`}
            onClick={() => setActiveTab('audit')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ShieldAlert size={16} /> Wagi i Historia Audytu
          </button>
          <button
            className={`tab-btn ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => setActiveTab('chat')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Send size={16} /> Czat z Pacjentem
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TAB 1: PAKIETY DIET & KREATOR TYGODNIOWY                       */}
      {/* ============================================================== */}
      {activeTab === 'packages' && (
        <div>
          {/* Top action bar: Groups filter & New Package button */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Grupa diety:</span>
              {categoryFilterOptions.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategoryFilter(cat)}
                  className={`btn btn-sm ${selectedCategoryFilter === cat ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ fontSize: '0.8rem' }}
                >
                  {cat}
                </button>
              ))}

              {showAddGroupInput ? (
                <form onSubmit={handleAddGroup} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nazwa nowej grupy..."
                    autoFocus
                    style={{
                      background: '#111827',
                      border: '1px solid #10b981',
                      color: '#fff',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '6px',
                      fontSize: '0.8rem'
                    }}
                  />
                  <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    Zapisz
                  </button>
                  <button type="button" onClick={() => setShowAddGroupInput(false)} className="btn btn-secondary btn-sm" style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}>
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowAddGroupInput(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', border: '1px dashed rgba(255,255,255,0.2)' }}
                  title="Dodaj nową grupę diety"
                >
                  <Plus size={14} /> Grupa
                </button>
              )}
            </div>

            <button onClick={initNewPackage} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Plus size={16} /> + Utwórz Nowy Pakiet Tygodniowy
            </button>
            <button
              onClick={() => setShowPdfImportModal(true)}
              className="btn btn-secondary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <FileText size={16} /> Importuj dietę z PDF
            </button>
          </div>

          {/* Templates Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.25rem' }}>
            {filteredTemplates.map((tpl) => {
              const isExpanded = expandedTemplateId === tpl.id;
              const hasAssignments = tpl.assignments && tpl.assignments.length > 0;
              return (
                <div
                  key={tpl.id}
                  className="glass-panel"
                  style={{
                    padding: '1.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.75rem', fontWeight: 700 }}>
                        {tpl.category}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        {tpl.days_data?.length || 7} dni w pakiecie
                      </span>
                    </div>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                      {tpl.name}
                    </h3>

                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem', minHeight: '38px', lineHeight: 1.4 }}>
                      {tpl.description || 'Brak dodatkowego opisu.'}
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>CEL KALORII:</span>
                        <div style={{ fontWeight: 800, color: '#10b981', fontSize: '1rem' }}>
                          {tpl.target_calories} kcal / dzień
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>LICZBA POSIŁKÓW:</span>
                        <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1rem' }}>
                          {tpl.meals_per_day} posiłki / dzień
                        </div>
                      </div>
                    </div>

                    {/* Status doręczenia / historia przypisań do pacjentów */}
                    <div style={{ marginBottom: '1rem', padding: '0.65rem 0.85rem', background: 'rgba(0,0,0,0.25)', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Package size={13} color="var(--accent-emerald)" /> Status doręczenia pacjentom:
                      </div>
                      {hasAssignments ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                          {tpl.assignments.slice(0, 3).map((a, aIdx) => (
                            <div key={aIdx} style={{ fontSize: '0.78rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.2rem' }}>
                              <span>✓ <strong>{a.patient_name || a.patient_email}</strong> ({a.start_date})</span>
                              <span style={{ color: 'var(--accent-emerald)', fontSize: '0.72rem', fontWeight: 700 }}>Doręczono</span>
                            </div>
                          ))}
                          {tpl.assignments.length > 3 && (
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>+ jeszcze {tpl.assignments.length - 3} pacjentów</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>Pakiet nie został jeszcze przypisany do żadnego pacjenta.</span>
                      )}
                    </div>

                    {/* Przycisk rozwijania podglądu przepisów w pakiecie */}
                    <button
                      type="button"
                      onClick={() => setExpandedTemplateId(isExpanded ? null : tpl.id)}
                      className="btn btn-secondary btn-sm"
                      style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', fontSize: '0.8rem' }}
                    >
                      <Eye size={14} /> {isExpanded ? 'Ukryj przepisy w pakiecie' : `Pokaż przepisy w pakiecie (${tpl.days_data?.length || 7} dni)`}
                    </button>

                    {/* Rozwinięty widok dań i przepisów na 7 dni */}
                    {isExpanded && (
                      <div style={{ maxHeight: '280px', overflowY: 'auto', marginBottom: '1rem', background: 'rgba(0,0,0,0.25)', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                        {(tpl.days_data || []).map((day, dIdx) => (
                          <div key={dIdx} style={{ marginBottom: '0.65rem' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--accent-emerald)', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '0.2rem', marginBottom: '0.3rem' }}>
                              {day.day_name || POLISH_DAYS[dIdx] || `Dzień ${dIdx + 1}`}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {(day.meals || []).map((m, mIdx) => {
                                const rec = recipesMap[m.recipe_id];
                                const mealTitle = rec?.title || m.title || `Przepis #${m.recipe_id}`;
                                const mealCal = rec ? Math.round(rec.calories * (m.portions || 1)) : (m.calories ? Math.round(m.calories * (m.portions || 1)) : null);
                                return (
                                  <div key={mIdx} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                                    <span><strong>{m.meal_type}:</strong> {mealTitle} ({m.portions || 1} porc.)</span>
                                    <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{mealCal ? `${mealCal} kcal` : ''}</span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                    <button
                      onClick={() => openSendPackageModal(tpl)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                    >
                      <Send size={14} /> Prześlij paczkę
                    </button>

                    <button
                      onClick={() => openEditPackageModal(tpl)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.6rem' }}
                      title="Edytuj pakiet"
                    >
                      <Edit3 size={15} />
                    </button>

                    <button
                      onClick={() => handleDeleteTemplate(tpl.id, tpl.name)}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-rose)' }}
                      title="Usuń pakiet"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 2: KREATOR PRZEPISÓW & BAZA PRODUKTÓW                      */}
      {/* ============================================================== */}
      {activeTab === 'crud' && (
        <div>
          {/* Subtabs for Recipes vs Products */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className={`btn btn-sm ${crudSubTab === 'recipes' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCrudSubTab('recipes')}
              >
                <BookOpen size={15} /> Baza Przepisów ({recipes.length})
              </button>
              <button
                className={`btn btn-sm ${crudSubTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setCrudSubTab('products')}
              >
                <Utensils size={15} /> Baza Produktów Dyskontowych ({products.length})
              </button>
            </div>

            {crudSubTab === 'recipes' ? (
              <button onClick={openCreateRecipeModal} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> + Dodaj Nowy Przepis ze Zdjęciem
              </button>
            ) : (
              <button onClick={openCreateProductModal} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Plus size={16} /> + Dodaj Nowy Produkt Dyskontowy
              </button>
            )}
          </div>

          {/* RECIPES LIST */}
          {crudSubTab === 'recipes' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Filtruj przepisy po tytule lub kategorii..."
                  value={recipeSearch}
                  onChange={(e) => setRecipeSearch(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: '#111827',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
                {recipes
                  .filter((r) => r.title.toLowerCase().includes(recipeSearch.toLowerCase()) || r.category.toLowerCase().includes(recipeSearch.toLowerCase()))
                  .map((r) => (
                    <div
                      key={r.id}
                      className="glass-panel"
                      style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                    >
                      {r.image_url ? (
                        <div style={{ width: '100%', height: '140px', overflow: 'hidden' }}>
                          <img
                            src={r.image_url}
                            alt={r.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        </div>
                      ) : (
                        <div style={{ width: '100%', height: '80px', background: 'rgba(255,255,255,0.02)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Utensils size={28} color="var(--text-dim)" />
                        </div>
                      )}

                      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                            <span className="badge badge-emerald">{r.category}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.preparation_time_minutes} min</span>
                          </div>
                          <h4 style={{ fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>{r.title}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            <span>🔥 {r.calories} kcal</span>
                            <span>🥩 {r.protein_g}g</span>
                            <span>🥑 {r.fat_g}g</span>
                            <span>🌾 {r.carbs_g}g</span>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginTop: '0.5rem' }}>
                          <button
                            onClick={() => setInspectingRecipeId(r.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                            title="Zobacz szczegóły, składniki i opis przepisu"
                          >
                            <Eye size={14} /> Szczegóły
                          </button>
                          <button
                            onClick={() => openEditRecipeModal(r)}
                            className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                            title="Edytuj dane i składniki przepisu"
                          >
                            <Edit3 size={14} /> Edytuj
                          </button>
                        </div>
                        <button
                          onClick={() => promptDeleteRecipe(r)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            width: '100%',
                            marginTop: '0.4rem',
                            color: '#f43f5e',
                            borderColor: 'rgba(244,63,94,0.35)',
                            background: 'rgba(244,63,94,0.08)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.4rem',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                          }}
                          title="Usuń ten przepis z bazy danych"
                        >
                          <Trash2 size={14} /> Usuń przepis
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* PRODUCTS LIST */}
          {crudSubTab === 'products' && (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Filtruj produkty po nazwie, sklepie lub marce..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  style={{
                    width: '100%',
                    maxWidth: '450px',
                    background: '#111827',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                {products
                  .filter((p) => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.store.toLowerCase().includes(productSearch.toLowerCase()))
                  .map((p) => (
                    <div key={p.id} className="glass-panel" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span className={`badge ${getStoreBadgeClass(p.store)}`}>
                          {p.store}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{p.category}</span>
                      </div>
                      <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{p.name}</h4>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
                        Marka: {p.brand || 'Brak'} | EAN: {p.barcode || 'Brak'}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 0.6rem', borderRadius: '6px', marginBottom: '0.75rem' }}>
                        <span>{p.calories_per_100g} kcal</span>
                        <span>B: {p.protein_per_100g}g</span>
                        <span>T: {p.fat_per_100g}g</span>
                        <span>W: {p.carbs_per_100g}g</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button onClick={() => openEditProductModal(p)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                          <Edit3 size={13} /> Edytuj
                        </button>
                        <button onClick={() => handleDeleteProduct(p.id, p.name)} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-rose)' }}>
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 3: GOALS & RECOMMENDATIONS                                  */}
      {/* ============================================================== */}
      {activeTab === 'goals' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={20} color="#10b981" /> Oficjalne Rekomendacje Dietetyczne
              </h3>
              {selectedPatient && (
                <button
                  type="button"
                  onClick={() => setShowRecModal(true)}
                  style={{
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    color: '#34d399',
                    padding: '0.4rem 0.85rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <History size={14} />
                  Pełna historia zaleceń
                </button>
              )}
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Wskazówki wyświetlane na samej górze panelu pacjenta (każda zmiana generuje automatyczne powiadomienie dla pacjenta).
            </p>


            <form onSubmit={handleSaveGoals} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Treść Zaleceń:</label>
                <textarea
                  rows="6"
                  value={recommendations}
                  onChange={(e) => setRecommendations(e.target.value)}
                  placeholder="np. 1. Pij minimum 2.5 l wody dziennie&#10;2. Spożywaj posiłki w stałych odstępach co 3.5h&#10;3. Zjedz białko do każdego posiłku."
                  style={{
                    width: '100%',
                    background: '#111827',
                    border: '1px solid var(--border-subtle)',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    lineHeight: 1.5,
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cel Kalorii (kcal):</label>
                  <input
                    type="number"
                    value={dailyCalories}
                    onChange={(e) => setDailyCalories(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Ilość posiłków na dzień:</label>
                  <input
                    type="number"
                    value={mealsPerDay}
                    onChange={(e) => setMealsPerDay(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Rok urodzenia pacjenta:</label>
                <input
                  type="number"
                  min="1930" max="2015"
                  value={birthYear}
                  onChange={(e) => setBirthYear(e.target.value)}
                  placeholder="np. 1985"
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                />
                {birthYear && <span style={{ fontSize: '0.8rem', color: '#34d399' }}>Wiek: {new Date().getFullYear() - parseInt(birthYear)} lat</span>}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Białko (g):</label>
                  <input
                    type="number"
                    value={proteinG}
                    onChange={(e) => setProteinG(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tłuszcze (g):</label>
                  <input
                    type="number"
                    value={fatG}
                    onChange={(e) => setFatG(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Węglowodany (g):</label>
                  <input
                    type="number"
                    value={carbsG}
                    onChange={(e) => setCarbsG(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                <Save size={16} /> Zapisz Cele dla Pacjenta
              </button>
              {saveSuccess && (
                <div style={{ color: '#34d399', fontSize: '0.85rem', textAlign: 'center' }}>
                  ✓ Cele i zalecenia zostały pomyślnie zaktualizowane!
                </div>
              )}
            </form>
          </div>

          {/* Wykres wagi i talii pacjenta */}
          <div className="glass-panel" style={{ padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <TrendingDown size={20} color="#10b981" /> Postępy Pacjenta (Waga i Talia)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
              Miesięczny wykres trendu wagi oraz obwodu talii pacjenta: <strong style={{ color: '#fff' }}>{selectedPatient ? `${selectedPatient.first_name} ${selectedPatient.last_name}` : 'Wybierz pacjenta'}</strong>
            </p>
            <MonthlyMeasurementChart measurements={measurements} height={selectedPatientProfile?.height || 175} />
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 4: AUDIT LOG WEIGHT CORRECTIONS                            */}
      {/* ============================================================== */}
      {activeTab === 'audit' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldAlert size={20} color="#fbbf24" /> Pomiary Pacjenta & Bezpieczna Korekta
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Każda korekta błędu pacjenta wymaga podania powodu i jest trwale zapisywana w dzienniku audytu.
            </p>

            {/* Wykres zmian wagi i talii w audycie */}
            <div style={{ marginBottom: '1.5rem' }}>
              <MonthlyMeasurementChart measurements={measurements} height={selectedPatientProfile?.height || 175} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {measurements.map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <span style={{ color: 'var(--text-dim)', marginRight: '0.75rem' }}>{m.date}</span>
                    <strong style={{ color: '#10b981', fontSize: '1.1rem' }}>{m.weight} kg</strong>
                    {m.waist_cm && <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem' }}>({m.waist_cm} cm)</span>}
                    {m.notes && <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>{m.notes}</div>}
                  </div>

                  <button
                    onClick={() => {
                      setEditingMeasurement(m);
                      setCorrectWeight(m.weight.toString());
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    <Edit3 size={14} /> Skoryguj wagę
                  </button>
                </div>
              ))}
            </div>

            {editingMeasurement && (
              <form onSubmit={handleCorrectMeasurement} style={{ marginTop: '1.5rem', background: 'rgba(0,0,0,0.3)', padding: '1.25rem', borderRadius: '10px', border: '1px solid #fbbf24' }}>
                <h4 style={{ fontWeight: 800, color: '#fbbf24', marginBottom: '0.5rem' }}>
                  Korekta pomiaru z dnia {editingMeasurement.date}
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Poprawna waga (kg):</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={correctWeight}
                      onChange={(e) => setCorrectWeight(e.target.value)}
                      style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Powód korekty (wymagane w audycie):</label>
                    <input
                      type="text"
                      required
                      placeholder="np. Błąd wpisania przecinka przez pacjenta"
                      value={correctReason}
                      onChange={(e) => setCorrectReason(e.target.value)}
                      style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="btn btn-primary btn-sm">Zatwierdź korektę</button>
                  <button type="button" onClick={() => setEditingMeasurement(null)} className="btn btn-secondary btn-sm">Anuluj</button>
                </div>
              </form>
            )}
          </div>

          {/* Audit Logs History */}
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={20} color="#10b981" /> Historia Zmian (Audit Log)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
              {auditLogs.map((log) => (
                <div key={log.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.8rem', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)', marginBottom: '0.2rem' }}>
                    <span>{new Date(log.created_at).toLocaleString()}</span>
                    <strong style={{ color: '#fbbf24' }}>{log.changed_by_name}</strong>
                  </div>
                  <div>
                    Korekta {log.field_name}: <s>{log.old_value}</s> → <strong>{log.new_value}</strong>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.2rem' }}>
                    Powód: {log.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 5: CHAT                                                    */}
      {/* ============================================================== */}
      {activeTab === 'chat' && selectedPatient && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ChatWidget receiverId={selectedPatient.id} receiverName={`${selectedPatient.first_name} ${selectedPatient.last_name}`} />
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: KREATOR NOWEGO PAKIETU TYGODNIOWEGO Z KALKULATOREM      */}
      {/* ============================================================== */}
      {showTemplateModal && (
        <div className="modal-overlay" onClick={() => setShowTemplateModal(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '1060px', width: '95vw', maxHeight: '92vh', overflowY: 'auto', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ background: 'rgba(16,185,129,0.15)', padding: '0.6rem', borderRadius: '12px' }}>
                  <Layers size={24} color="#10b981" />
                </div>
                <div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                    {editingTemplate ? `Edycja Pakietu: ${editingTemplate.name}` : 'Kreator Nowego Pakietu Diety Tygodniowej'}
                  </h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    7-dniowy rozkład posiłków z automatycznym kalkulatorem wartości odżywczych
                  </p>
                </div>
              </div>
              <button onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleSavePackage}>
              {/* Basic Package Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nazwa pakietu diety*</label>
                  <input
                    type="text"
                    required
                    placeholder="np. Dieta Redukcyjna Biedronka & Lidl 1800 kcal"
                    value={tplName}
                    onChange={(e) => setTplName(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Grupa diety:*</label>
                  <select
                    value={tplCategory}
                    onChange={(e) => setTplCategory(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  >
                    <option value="Bez grupy">— Bez grupy —</option>
                    {allDietGroups.map((grp) => (
                      <option key={grp} value={grp}>{grp}</option>
                    ))}
                    <option value="__custom_new__">+ Nowa grupa...</option>
                  </select>
                  {tplCategory === '__custom_new__' && (
                    <input
                      type="text"
                      placeholder="Wpisz nazwę nowej grupy diety"
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val && !customGroups.includes(val)) {
                          setCustomGroups(prev => [...prev, val]);
                        }
                        setTplCategory(val);
                      }}
                      style={{ width: '100%', marginTop: '0.4rem', background: '#111827', border: '1px solid #10b981', color: '#fff', padding: '0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
                    />
                  )}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.6fr', gap: '1rem', marginBottom: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Krótki opis pakietu</label>
                  <input
                    type="text"
                    placeholder="Wskazówki dla pacjenta, główne założenia diety"
                    value={tplDescription}
                    onChange={(e) => setTplDescription(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Docelowe kcal/dzień*</label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={tplTargetCalories}
                    onChange={(e) => setTplTargetCalories(parseInt(e.target.value) || 1800)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px', fontWeight: 700 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Posiłki w ciągu dnia*</label>
                  <select
                    value={tplMealsPerDay}
                    onChange={(e) => handleTplMealsPerDayChange(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  >
                    <option value={3}>3 posiłki (Śniadanie, Obiad, Kolacja)</option>
                    <option value={4}>4 posiłki (+ Drugie śniadanie)</option>
                    <option value={5}>5 posiłków (Pełny rozkład: + Podwieczorek)</option>
                  </select>
                </div>
              </div>

              {/* Opcja podziału obiadu na 2 dania */}
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.65rem 0.9rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid var(--border-subtle)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={splitLunch}
                    onChange={(e) => handleSplitLunchToggle(e.target.checked)}
                    style={{ accentColor: 'var(--accent-emerald)', width: '16px', height: '16px' }}
                  />
                  <span>🍲 Podziel obiad na 2 dania: <strong>I danie (zupa)</strong> oraz <strong>II danie (danie główne)</strong></span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Kolejność: Śniadanie → 2. śniadanie → Obiad (I+II) → Podwieczorek → Kolacja
                </span>
              </div>

              {/* Day Tabs Bar */}
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {tplDaysData.map((day, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setTplActiveDayIdx(idx)}
                    className={`btn btn-sm ${tplActiveDayIdx === idx ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ flex: 1, minWidth: '95px' }}
                  >
                    {POLISH_DAYS[idx] || day.day_name || `Dzień ${idx + 1}`}
                  </button>
                ))}
              </div>

              {/* LIVE NUTRITIONAL BUDGET CALCULATOR */}
              <div
                style={{
                  background: isOverCal ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.1)',
                  border: isOverCal ? '1px solid rgba(244,63,94,0.4)' : '1px solid rgba(16,185,129,0.4)',
                  padding: '1rem 1.25rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calculator size={18} color={isOverCal ? '#f43f5e' : '#10b981'} />
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>
                      Kalkulator wartości odżywczych dla: {POLISH_DAYS[tplActiveDayIdx]}
                    </span>
                  </div>

                  {isOverCal ? (
                    <span className="badge" style={{ background: '#f43f5e', color: '#fff', fontWeight: 800 }}>
                      ⚠️ PRZEKROCZONO LIMIT O +{calDifference} KCAL!
                    </span>
                  ) : (
                    <span className="badge badge-emerald" style={{ fontWeight: 800 }}>
                      ✓ W NORMIE: ZAPAS {targetCal - activeDayMacros.cal} KCAL
                    </span>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>KALORIE</span>
                    <div style={{ fontWeight: 800, color: isOverCal ? '#f43f5e' : '#34d399', fontSize: '1.05rem' }}>
                      {activeDayMacros.cal} / {targetCal} kcal
                    </div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>BIAŁKO</span>
                    <div style={{ fontWeight: 800, color: '#38bdf8' }}>{activeDayMacros.p} g</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>TŁUSZCZE</span>
                    <div style={{ fontWeight: 800, color: '#fbbf24' }}>{activeDayMacros.f} g</div>
                  </div>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.5rem', borderRadius: '6px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>WĘGLOWODANY</span>
                    <div style={{ fontWeight: 800, color: '#818cf8' }}>{activeDayMacros.c} g</div>
                  </div>
                </div>
              </div>

              {/* Meals assigner for active day */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                    Dania na ten dzień ({tplDaysData[tplActiveDayIdx]?.meals.length} posiłki):
                  </span>
                  <button
                    type="button"
                    onClick={copyCurrentDayToAllDays}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Skopiuj ten dzień na cały tydzień (Pon-Ndz)
                  </button>
                </div>

                {tplDaysData[tplActiveDayIdx]?.meals.map((meal, mIdx) => (
                  <div
                    key={mIdx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '165px minmax(0, 1fr) 115px',
                      gap: '0.65rem',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.02)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      <select
                        value={meal.meal_type}
                        onChange={(e) => updateTplMeal(tplActiveDayIdx, mIdx, 'meal_type', e.target.value)}
                        style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#34d399', fontWeight: 700, padding: '0.45rem', borderRadius: '6px', fontSize: '0.82rem' }}
                      >
                        <option value="Śniadanie">Śniadanie</option>
                        <option value="Drugie śniadanie">Drugie śniadanie</option>
                        <option value="Obiad">Obiad</option>
                        <option value="Obiad (I danie - zupa)">Obiad (I danie - zupa)</option>
                        <option value="Obiad (II danie)">Obiad (II danie)</option>
                        <option value="Podwieczorek">Podwieczorek</option>
                        <option value="Kolacja">Kolacja</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', minWidth: 0 }}>
                      <select
                        value={meal.recipe_id}
                        onChange={(e) => updateTplMeal(tplActiveDayIdx, mIdx, 'recipe_id', parseInt(e.target.value))}
                        style={{ flex: 1, minWidth: 0, background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.45rem', borderRadius: '6px', fontSize: '0.85rem' }}
                      >
                        {!recipes.some(r => r.id === meal.recipe_id) && (
                          <option value={meal.recipe_id}>
                            [{meal.meal_type || 'Posiłek'}] {meal.title || `Przepis #${meal.recipe_id}`} ({meal.calories || '?'} kcal)
                          </option>
                        )}
                        {recipes.map((r) => (
                          <option key={r.id} value={r.id}>
                            [{r.category}] {r.title} ({r.calories} kcal, ⏱ {r.preparation_time_minutes} min)
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setInspectingRecipeId(meal.recipe_id)}
                        title="Szczegóły przepisu (zdjęcie, składniki, opis)"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', flexShrink: 0, borderRadius: '6px' }}
                      >
                        <Eye size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const rec = recipes.find(x => x.id === meal.recipe_id);
                          if (rec) openEditRecipeModal(rec);
                        }}
                        title="Edytuj dane i składniki tego przepisu w bazie"
                        className="btn btn-secondary btn-sm"
                        style={{ width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, borderRadius: '6px' }}
                      >
                        <Edit3 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', flexShrink: 0 }}>
                      <input
                        type="number"
                        step="0.1"
                        min="0.2"
                        max="5"
                        value={meal.portions}
                        onChange={(e) => updateTplMeal(tplActiveDayIdx, mIdx, 'portions', parseFloat(e.target.value) || 1.0)}
                        style={{ width: '56px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem 0.2rem', borderRadius: '6px', textAlign: 'center', fontWeight: 700 }}
                      />
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>porcji</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => { setShowTemplateModal(false); setEditingTemplate(null); }} className="btn btn-secondary">
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={16} /> {editingTemplate ? 'Zapisz Zmiany w Pakiecie' : 'Zapisz i Utwórz Pakiet Diety'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: PRZEŚLIJ PACZKĘ DO PACJENTA                             */}
      {/* ============================================================== */}
      {showSendModal && templateToSend && (
        <div className="modal-overlay" onClick={() => setShowSendModal(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '560px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Send size={22} color="#10b981" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Wdróż Pakiet do Kalendarza Pacjenta</h2>
              </div>
              <button onClick={() => setShowSendModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <div style={{ background: 'rgba(16,185,129,0.08)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.3)', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 800, color: '#34d399' }}>{templateToSend.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Kategoria: {templateToSend.category} • Cel: {templateToSend.target_calories} kcal • 7 dni
              </div>
            </div>

            <form onSubmit={handleSendPackageToPatient} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Wybierz pacjenta docelowego*</label>
                <select
                  value={sendPatientId}
                  onChange={(e) => setSendPatientId(e.target.value)}
                  required
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                >
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.first_name} {p.last_name} ({p.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data startowa (dzień 1 - 7 kolejnych dni)*</label>
                <input
                  type="date"
                  required
                  value={sendStartDate}
                  onChange={(e) => setSendStartDate(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Notatki / wskazówki dla pacjenta</label>
                <input
                  type="text"
                  value={sendNotes}
                  onChange={(e) => setSendNotes(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                />
              </div>

              {sendFeedback && (
                <div style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(16,185,129,0.2)', color: '#34d399', fontWeight: 700, fontSize: '0.85rem' }}>
                  ✓ {sendFeedback}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowSendModal(false)} className="btn btn-secondary">
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Wdróż i Powiadom Pacjenta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DODAJ / EDYTUJ PRZEPIS ZE ZDJĘCIEM                      */}
      {/* ============================================================== */}
      {showRecipeModal && (
        <div className="modal-overlay" onClick={() => setShowRecipeModal(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Utensils size={22} color="#10b981" />
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {editingRecipe ? 'Edycja Przepisu' : 'Nowy Przepis ze Zdjęciem'}
                </h2>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {editingRecipe && (
                  <button
                    type="button"
                    onClick={() => {
                      setShowRecipeModal(false);
                      promptDeleteRecipe(editingRecipe);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{
                      color: '#f43f5e',
                      borderColor: 'rgba(244, 63, 94, 0.5)',
                      background: 'rgba(244, 63, 94, 0.12)',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontWeight: 700,
                    }}
                    title="Usuń ten przepis z bazy danych"
                  >
                    <Trash2 size={15} /> Usuń przepis
                  </button>
                )}
                <button onClick={() => setShowRecipeModal(false)} className="btn btn-secondary btn-sm">✕</button>
              </div>
            </div>

            <form onSubmit={handleSaveRecipe} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Informacja o wartościach odżywczych przepisu */}
              {(() => {
                const computedMacros = recipeFormIngredients.reduce((acc, ing) => {
                  const prod = products.find((p) => p.id === parseInt(ing.product_id));
                  if (!prod || !ing.amount_g) return acc;
                  const factor = (parseFloat(ing.amount_g) || 0) / 100.0;
                  return {
                    cal: acc.cal + (parseFloat(prod.calories_per_100g) || 0) * factor,
                    p: acc.p + (parseFloat(prod.protein_per_100g) || 0) * factor,
                    f: acc.f + (parseFloat(prod.fat_per_100g) || 0) * factor,
                    c: acc.c + (parseFloat(prod.carbs_per_100g) || 0) * factor,
                  };
                }, { cal: 0, p: 0, f: 0, c: 0 });

                const displayCal = computedMacros.cal > 0
                  ? Math.round(computedMacros.cal)
                  : (editingRecipe ? Math.round(editingRecipe.calories) : 0);
                const displayP = computedMacros.p > 0
                  ? Math.round(computedMacros.p * 10) / 10
                  : (editingRecipe ? Math.round(editingRecipe.protein_g * 10) / 10 : 0);
                const displayF = computedMacros.f > 0
                  ? Math.round(computedMacros.f * 10) / 10
                  : (editingRecipe ? Math.round(editingRecipe.fat_g * 10) / 10 : 0);
                const displayC = computedMacros.c > 0
                  ? Math.round(computedMacros.c * 10) / 10
                  : (editingRecipe ? Math.round(editingRecipe.carbs_g * 10) / 10 : 0);

                return (
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    borderRadius: '10px',
                    padding: '0.85rem 1rem',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#34d399', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Flame size={16} /> Wartości odżywcze dania (1 porcja):
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {computedMacros.cal > 0 ? 'Na bieżąco ze składników' : 'Zapisane w bazie'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Kalorie</span>
                        <div style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.05rem' }}>
                          {displayCal} <span style={{ fontSize: '0.72rem' }}>kcal</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Białko</span>
                        <div style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.05rem' }}>
                          {displayP} <span style={{ fontSize: '0.72rem' }}>g</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Tłuszcze</span>
                        <div style={{ fontWeight: 800, color: '#f59e0b', fontSize: '1.05rem' }}>
                          {displayF} <span style={{ fontSize: '0.72rem' }}>g</span>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.25)', padding: '0.5rem', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Węglowodany</span>
                        <div style={{ fontWeight: 800, color: '#a78bfa', fontSize: '1.05rem' }}>
                          {displayC} <span style={{ fontSize: '0.72rem' }}>g</span>
                        </div>
                      </div>
                    </div>

                    {editingRecipe && (editingRecipe.calories_female || editingRecipe.calories_male) && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', paddingTop: '0.45rem', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                        <span>👩 Kobieta: <strong style={{ color: '#fff' }}>{Math.round(editingRecipe.calories_female)} kcal</strong> (B: {editingRecipe.protein_female_g}g, T: {editingRecipe.fat_female_g}g, W: {editingRecipe.carbs_female_g}g)</span>
                        <span>👨 Mężczyzna: <strong style={{ color: '#fff' }}>{Math.round(editingRecipe.calories_male)} kcal</strong> (B: {editingRecipe.protein_male_g}g, T: {editingRecipe.fat_male_g}g, W: {editingRecipe.carbs_male_g}g)</span>
                      </div>
                    )}
                  </div>
                );
              })()}
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tytuł przepisu*</label>
                <input
                  type="text"
                  required
                  placeholder="np. Aromatyczny fit bowl z pieczonym łososiem i awokado"
                  value={recipeFormTitle}
                  onChange={(e) => setRecipeFormTitle(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kategoria*</label>
                  <select
                    value={recipeFormCategory}
                    onChange={(e) => setRecipeFormCategory(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  >
                    <option value="Śniadanie">Śniadanie</option>
                    <option value="Drugie śniadanie">Drugie śniadanie</option>
                    <option value="Obiad">Obiad</option>
                    <option value="Przekąska / Podwieczorek">Przekąska / Podwieczorek</option>
                    <option value="Kolacja">Kolacja</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Czas (min)*</label>
                  <input
                    type="number"
                    required
                    value={recipeFormPrepTime}
                    onChange={(e) => setRecipeFormPrepTime(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Domyślna porcja</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={recipeFormPortions}
                    onChange={(e) => setRecipeFormPortions(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              {/* Zdjęcie potrawy: Upload LUB URL */}
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
                  <Image size={16} color="#10b981" /> Zdjęcie Dania (Upload z dysku lub link URL)
                </label>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', alignItems: 'center' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Wklej bezpośredni link URL (np. z Unsplash)..."
                      value={recipeFormImageUrl}
                      onChange={(e) => setRecipeFormImageUrl(e.target.value)}
                      style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px', marginBottom: '0.5rem', fontSize: '0.8rem' }}
                    />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer', margin: 0 }}>
                        <Upload size={14} /> Wgraj plik z dysku
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      {imageUploading && <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Wgrywanie zdjęcia...</span>}
                    </div>
                  </div>

                  {recipeFormImageUrl && (
                    <div style={{ width: '100%', height: '90px', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                      <img
                        src={recipeFormImageUrl}
                        alt="Podgląd dania"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Instrukcja przygotowania krok po kroku*</label>
                <textarea
                  rows="4"
                  required
                  value={recipeFormInstructions}
                  onChange={(e) => setRecipeFormInstructions(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.65rem', borderRadius: '6px', fontSize: '0.85rem' }}
                />
              </div>

              {/* Ingredients selector for NEW & EDITED recipes */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>
                    Składniki z Bazy Dyskontowej (usuń zbędne, popraw gramaturę lub dodaj nowe):
                  </label>
                  <button
                    type="button"
                    onClick={() => setRecipeFormIngredients([...recipeFormIngredients, { product_id: products[0]?.id || 1, amount_g: 100 }])}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '0.75rem' }}
                  >
                    + Dodaj składnik
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {recipeFormIngredients.length === 0 ? (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '0.5rem' }}>
                      Brak składników. Kliknij "+ Dodaj składnik" powyżej, aby dodać produkty z bazy.
                    </div>
                  ) : (
                    recipeFormIngredients.map((ing, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <select
                          value={ing.product_id}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setRecipeFormIngredients((prev) => prev.map((item, i) => i === idx ? { ...item, product_id: val } : item));
                          }}
                          style={{ flex: 2, background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem', borderRadius: '6px', fontSize: '0.8rem' }}
                        >
                          {products.map((p) => (
                            <option key={p.id} value={p.id}>
                              [{p.store}] {p.name} ({p.calories_per_100g} kcal/100g)
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          placeholder="g / ml"
                          value={ing.amount_g}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            setRecipeFormIngredients((prev) => prev.map((item, i) => i === idx ? { ...item, amount_g: val } : item));
                          }}
                          style={{ width: '80px', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.4rem', borderRadius: '6px', textAlign: 'center' }}
                        />
                        <button
                          type="button"
                          onClick={() => setRecipeFormIngredients((prev) => prev.filter((_, i) => i !== idx))}
                          className="btn btn-secondary btn-sm"
                          title="Usuń ten składnik"
                          style={{ color: 'var(--accent-rose)' }}
                        >
                          ✕
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  {editingRecipe && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        type="button"
                        onClick={() => setInspectingRecipeId(editingRecipe.id)}
                        className="btn btn-secondary"
                        style={{ color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        title="Podgląd zdjęcia, składników i opisu dania"
                      >
                        <Eye size={15} /> Szczegóły
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowRecipeModal(false);
                          promptDeleteRecipe(editingRecipe);
                        }}
                        className="btn btn-secondary"
                        style={{ color: '#fff', borderColor: '#f43f5e', background: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700 }}
                        title="Usuń ten przepis z bazy danych"
                      >
                        <Trash2 size={15} /> Usuń przepis
                      </button>
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button type="button" onClick={() => setShowRecipeModal(false)} className="btn btn-secondary">
                    Anuluj
                  </button>
                  <button type="submit" className="btn btn-primary">
                    <Save size={15} /> Zapisz Przepis
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: DODAJ / EDYTUJ PRODUKT DYSKONTOWY                       */}
      {/* ============================================================== */}
      {showProductModal && (
        <div className="modal-overlay" onClick={() => setShowProductModal(false)} style={{ zIndex: 1200 }}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '580px', padding: '2rem' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                {editingProduct ? 'Edycja Produktu' : 'Nowy Produkt z Dyskontu'}
              </h2>
              <button onClick={() => setShowProductModal(false)} className="btn btn-secondary btn-sm">✕</button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nazwa produktu*</label>
                <input
                  type="text"
                  required
                  placeholder="np. Twaróg wędzony lekki Pilos"
                  value={productFormName}
                  onChange={(e) => setProductFormName(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sklep*</label>
                  <select
                    value={productFormStore}
                    onChange={(e) => setProductFormStore(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  >
                    <option value="Lidl">Lidl</option>
                    <option value="Biedronka">Biedronka</option>
                    <option value="Kaufland">Kaufland</option>
                    <option value="Carrefour">Carrefour</option>
                    <option value="Ogolne">Ogólne / Inne</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Marka</label>
                  <input
                    type="text"
                    placeholder="np. Pilos"
                    value={productFormBrand}
                    onChange={(e) => setProductFormBrand(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kategoria</label>
                  <input
                    type="text"
                    value={productFormCategory}
                    onChange={(e) => setProductFormCategory(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Kcal/100g*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={productFormKcal}
                    onChange={(e) => setProductFormKcal(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Białko/100g*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={productFormProtein}
                    onChange={(e) => setProductFormProtein(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Tłuszcz/100g*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={productFormFat}
                    onChange={(e) => setProductFormFat(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Węgle/100g*</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={productFormCarbs}
                    onChange={(e) => setProductFormCarbs(e.target.value)}
                    style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.5rem', borderRadius: '6px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Kod kreskowy (EAN / Barcode)</label>
                <input
                  type="text"
                  placeholder="np. 20000088 lub 590000000000"
                  value={productFormBarcode}
                  onChange={(e) => setProductFormBarcode(e.target.value)}
                  style={{ width: '100%', background: '#111827', border: '1px solid var(--border-subtle)', color: '#fff', padding: '0.55rem', borderRadius: '6px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setShowProductModal(false)} className="btn btn-secondary">
                  Anuluj
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} /> Zapisz Produkt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Recommendations History Modal */}
      <RecommendationsHistoryModal
        isOpen={showRecModal}
        onClose={() => setShowRecModal(false)}
        patientId={selectedPatient?.id}
        isDietitian={true}
        onRecommendationAdded={(newRec) => {
          setRecommendations(newRec.content);
        }}
      />

      {/* PDF Import Modal */}
      <PdfImportModal
        isOpen={showPdfImportModal}
        onClose={() => setShowPdfImportModal(false)}
        availableGroups={allDietGroups}
        onSuccess={() => {
          setShowPdfImportModal(false);
          refreshTemplates();
          refreshRecipesAndProducts();
        }}
      />

      {/* Szczegóły przepisu dla dietetyka Modal */}
      {inspectingRecipeId && (
        <PortionScalerModal
          recipeId={inspectingRecipeId}
          initialPortions={1.0}
          onClose={() => setInspectingRecipeId(null)}
          onEdit={(scaled) => {
            const target = recipes.find((x) => x.id === (scaled?.id || inspectingRecipeId));
            if (target) {
              setInspectingRecipeId(null);
              openEditRecipeModal(target);
            }
          }}
          onDelete={(scaled) => {
            const target = recipes.find((x) => x.id === (scaled?.id || inspectingRecipeId)) || scaled;
            if (target) {
              setInspectingRecipeId(null);
              promptDeleteRecipe(target);
            }
          }}
        />
      )}

      {/* Modal bezpiecznego usuwania i zastępowania przepisu */}
      <RecipeDeleteModal
        isOpen={showRecipeDeleteModal}
        recipe={recipeToDelete}
        allRecipes={recipes}
        onClose={() => {
          setShowRecipeDeleteModal(false);
          setRecipeToDelete(null);
        }}
        onSuccess={(msg) => {
          alert(msg);
          setShowRecipeDeleteModal(false);
          setRecipeToDelete(null);
          refreshRecipesAndProducts();
          refreshTemplates();
        }}
      />
    </div>
  );

}
export default DietitianDashboard;
