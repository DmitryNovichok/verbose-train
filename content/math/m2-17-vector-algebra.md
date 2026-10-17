---
id: vector-algebra
title: Векторная алгебра
level: 2
module: Линейная алгебра и аналитическая геометрия
hours: 4
prereq: vectors-coord, determinants
summary: Базис и координаты, проекции, скалярное, векторное и смешанное произведения — формулы, геометрический и физический смысл.
---

## Базис и координаты

Векторы $\vec a_1,\dots,\vec a_k$ **линейно независимы**, если их линейная комбинация $\lambda_1\vec a_1+\dots+\lambda_k\vec a_k$ равна нулю только при всех $\lambda_i=0$. На плоскости независимы любые два неколлинеарных вектора, в пространстве — три некомпланарных.

**Базис** пространства — упорядоченная тройка некомпланарных векторов; любой вектор единственным образом раскладывается по базису. Стандартный ортонормированный базис $\vec i,\vec j,\vec k$ — единичные взаимно перпендикулярные векторы вдоль осей: $\vec a=a_x\vec i+a_y\vec j+a_z\vec k$.

**Направляющие косинусы**: $\cos\alpha=\frac{a_x}{|\vec a|}$, $\cos\beta=\frac{a_y}{|\vec a|}$, $\cos\gamma=\frac{a_z}{|\vec a|}$, причём $\cos^2\alpha+\cos^2\beta+\cos^2\gamma=1$.

## Скалярное произведение

$$\vec a\cdot\vec b=|\vec a||\vec b|\cos\varphi=a_xb_x+a_yb_y+a_zb_z.$$

**Проекция** $\vec a$ на направление $\vec b$: $\operatorname{пр}_{\vec b}\vec a=\dfrac{\vec a\cdot\vec b}{|\vec b|}$.

Физика: работа $A=\vec F\cdot\vec s$, мощность $P=\vec F\cdot\vec v$, магнитный поток $\Phi=\vec B\cdot\vec S$.

## Векторное произведение

:::def Векторное произведение
$\vec c=\vec a\times\vec b$ — вектор, который:
- перпендикулярен обоим векторам $\vec a$ и $\vec b$;
- по длине равен площади параллелограмма на них: $|\vec c|=|\vec a||\vec b|\sin\varphi$;
- направлен так, что тройка $\vec a,\vec b,\vec c$ правая (правило правой руки или буравчика).
:::

В координатах — «определитель» с базисными векторами в первой строке:
$$\vec a\times\vec b=\begin{vmatrix}\vec i&\vec j&\vec k\\a_x&a_y&a_z\\b_x&b_y&b_z\end{vmatrix}=(a_yb_z-a_zb_y;\ a_zb_x-a_xb_z;\ a_xb_y-a_yb_x).$$

Свойства: $\vec a\times\vec b=-\vec b\times\vec a$ (антикоммутативность); $\vec a\times\vec a=\vec0$; $\vec a\times\vec b=\vec0\iff\vec a\parallel\vec b$.

Физика: момент силы $\vec M=\vec r\times\vec F$, момент импульса $\vec L=\vec r\times\vec p$, сила Лоренца $\vec F=q\,\vec v\times\vec B$, скорость точки вращающегося тела $\vec v=\vec\omega\times\vec r$.

:::example Найдите площадь треугольника с вершинами $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$.
$\overrightarrow{AB}=(-1;2;0)$, $\overrightarrow{AC}=(-1;0;3)$. $\overrightarrow{AB}\times\overrightarrow{AC}=(6;\,3;\,2)$, длина $\sqrt{36+9+4}=7$. Площадь треугольника — половина: $3{,}5$.
:::

## Смешанное произведение

$$(\vec a,\vec b,\vec c)=(\vec a\times\vec b)\cdot\vec c=\begin{vmatrix}a_x&a_y&a_z\\b_x&b_y&b_z\\c_x&c_y&c_z\end{vmatrix}.$$

Модуль — объём параллелепипеда на трёх векторах; знак — ориентация тройки (плюс — правая). Объём тетраэдра — шестая часть.

**Компланарность**: три вектора лежат в одной плоскости тогда и только тогда, когда их смешанное произведение равно нулю.

:::formulas
- $\vec a\cdot\vec b=a_xb_x+a_yb_y+a_zb_z=|\vec a||\vec b|\cos\varphi$ — скалярное произведение
- $\operatorname{пр}_{\vec b}\vec a=\dfrac{\vec a\cdot\vec b}{|\vec b|}$ — проекция
- $\vec a\times\vec b=\begin{vmatrix}\vec i&\vec j&\vec k\\a_x&a_y&a_z\\b_x&b_y&b_z\end{vmatrix}$ — векторное произведение
- $S_{\text{пар}}=|\vec a\times\vec b|,\ S_\triangle=\tfrac12|\vec a\times\vec b|$ — площади
- $V=|(\vec a,\vec b,\vec c)|,\ V_{\text{тетр}}=\tfrac16|(\vec a,\vec b,\vec c)|$ — объёмы
- $(\vec a,\vec b,\vec c)=0$ — условие компланарности
- $\vec M=\vec r\times\vec F$ — момент силы
:::

@tasks

@task num 1
Найдите $\vec a\cdot\vec b$ для $\vec a=(1;2;3)$, $\vec b=(3;-1;2)$.
@answer 7
@solution
$3-2+6=7$.

@task tuple 2
Найдите $\vec a\times\vec b$ для $\vec a=(1;2;3)$, $\vec b=(3;-1;2)$.
@answer 7; 7; -7
@solution
$(2\cdot2-3\cdot(-1);\ 3\cdot3-1\cdot2;\ 1\cdot(-1)-2\cdot3)=(7;7;-7)$.

@task num 2
Найдите площадь треугольника с вершинами $A(1;0;0)$, $B(0;2;0)$, $C(0;0;3)$.
@answer 3.5
@solution
См. пример.

@task num 1
Найдите объём параллелепипеда на векторах $(1;0;0)$, $(1;1;0)$, $(1;1;1)$.
@answer 1
@solution
Определитель треугольной матрицы равен 1.

@task num 2
При каком $\lambda$ векторы $(1;2;\lambda)$, $(0;1;1)$, $(1;0;1)$ компланарны?
@answer 3
@solution
$\begin{vmatrix}1&2&\lambda\\0&1&1\\1&0&1\end{vmatrix}=1-2(0-1)+\lambda(0-1)=3-\lambda=0$.

@task num 2
Найдите проекцию вектора $(3;4;0)$ на направление вектора $(2;1;2)$.
@answer 10/3
@solution
$\frac{6+4+0}{3}=\frac{10}3$.

@task num 1
Найдите угол между векторами $(1;1;0)$ и $(0;1;1)$ в градусах.
@answer 60
@unit °
@solution
$\cos\varphi=\frac{1}{\sqrt2\sqrt2}=\frac12$.

@task num 2
Сила $\vec F=(0;2;0)$ Н приложена в точке $\vec r=(1;0;0)$ м. Найдите модуль момента силы относительно начала координат.
@answer 2
@unit Н·м
@solution
$\vec r\times\vec F=(0;0;2)$.

@task num 2
Найдите объём тетраэдра с вершинами $(0;0;0)$, $(2;0;0)$, $(0;3;0)$, $(0;0;4)$.
@answer 4
@solution
$\frac16\cdot2\cdot3\cdot4=4$.

@task num 3
$|\vec a|=3$, $|\vec b|=4$, угол между ними $60^\circ$. Найдите $|\vec a-\vec b|$. Ответ через `sqrt`.
@answer sqrt(13)
@solution
$|\vec a-\vec b|^2=9+16-2\cdot3\cdot4\cdot\frac12=13$.
